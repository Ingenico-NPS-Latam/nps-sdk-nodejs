var soap = require('soap')
var crypto = require('crypto');
var constants = require('./constants')
var version = require('./version')
var Utils = require('./utils')
var beautify = require('xml-beautifier')
var services = require('./services')


var SoapClient = function (config) {
    this.config = config;
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

SoapClient.prototype.callClient = function (service, params, callback) {
    var localConfig = this.config;
    var log = this.log;
    var prepareResponse = this.prepareResponse;
    var Util = new Utils();
    var cache = ((localConfig.cache) === true ? false : true);
    var wsdl = Util.getWSDL(localConfig.environment);
    params = this.prepareRequest(params, localConfig, service);
    soap.createClient(wsdl, {disableCache: cache}, function handleRequest(err, client) {
        if (err) throw error;

        if (localConfig.cert){
            client.setSecurity(new soap.ClientSSLSecurity(
            localConfig.certKey,
            localConfig.cert,
            {/*default request options*/}
            ));
        }
        var options = {
            timeout: localConfig.timeout
        }
        options["proxy"] = localConfig.proxy;
        
        client[service](params, function handleResponse(error, response) {
            log(client.lastRequest, localConfig);
            if (!error){
                var response = prepareResponse(response.Respuesta);
                log(client.lastResponse, localConfig)
            }  else {
            if (!error){
                var response = prepareResponse(response.Respuesta);        
                log(client.lastResponse, localConfig)
            }
        }
        callback(error, response);
      }, options
      );
    });  
}

SoapClient.prototype.log = function(xml, config){

    if (config.logger) {
	    if(config.environment == constants.PRODUCTION && config.logLevel == constants.DEBUG) {
        	config.logger.error("DEBUG level is not allowed on PRODUCTION ENVIRONMENT")
    	} else {
		    var Util = new Utils();
		    config.logger.info(beautify(Util.ofuscate(xml)))
		    config.logger.debug(beautify(xml))
	    }
    }
};


SoapClient.prototype.addSecureHash = function(args, sKey){
    var keys = Object.keys(args).sort(),
    str = '';

    for (var i in keys) {
        if (typeof args[keys[i]] != 'object' && keys[i] != 'psp_SecureHash') {
            str += args[keys[i]];
        }
    }

    secure_hash = this.createHmacSha256Hash(str, sKey);

    args.psp_SecureHash = secure_hash;
    return args; 
};

SoapClient.prototype.createMd5Hash = function(data, key) {
    data += key;
    return crypto.createHash('md5').update(data).digest('hex');
};

SoapClient.prototype.createHmacSha256Hash = function(data, key) {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
};

SoapClient.prototype.createHmacSha512Hash = function(data, key) {
    return crypto.createHmac('sha512', key).update(data).digest('hex');
};

SoapClient.prototype.prepareResponse = function(args){
    var innerPrepareResponse = function(args) {
        var keys = Object.keys(args),
        response = {};
        for (var i in keys) {
            if (keys[i] !== 'attributes') {
                if (args[keys[i]].$value) {
                    response[keys[i]] = args[keys[i]].$value;
                } else {
                    response[keys[i]] = innerPrepareResponse(args[keys[i]]);
                }
            }
        }
        return response;
    } 
    return innerPrepareResponse(args)   
}


SoapClient.prototype.prepareRequest = function(args, config, service){
    var request = {};

    if (services.GET_MERCH_DET_NOT_ADD_SERVICES.indexOf(service) == -1) {
        args = this.addMerchantAdditionalDetails(args);
    }

    if (!args.psp_ClientSession){
        args = this.addSecureHash(args, config.secretKey);
    }

    if (this.config.sanitize){
        var Util = new Utils();
        args = Util.sanitize(args, true);
    }
    request.requiriment = args;
    return request;
};

SoapClient.prototype.addMerchantAdditionalDetails = function(args){
    if (!args.psp_MerchantAdditionalDetails) {
        args.psp_MerchantAdditionalDetails = {
            SdkInfo: constants.LANGUAGE + ' SDK Version: ' + version.VERSION
        };
    } else {
        Object.assign(args.psp_MerchantAdditionalDetails, {SdkInfo: constants.LANGUAGE + ' ' + version.VERSION});
    }


    return args;
}

module.exports = SoapClient;