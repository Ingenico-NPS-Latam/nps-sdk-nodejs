var soap = require('soap')
var crypto = require('crypto');
var constants = require('./constants')
var version = require('./version')
var Utils = require('./utils')
var beautify = require('xml-beautifier')


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
    params = this.prepareRequest(params, localConfig);
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
            log(beautify(client.lastRequest), localConfig);
            if (!error){
                var response = prepareResponse(response.Respuesta);
                log(beautify(client.lastResponse), localConfig)
            }  else {
            if (!error){
                var response = prepareResponse(response.Respuesta);        
                log(beautify(client.lastResponse), localConfig)
            }
        }
        callback(error, response);
      }, options
      );
    });  
}

SoapClient.prototype.log = function(args, config){
    
    if (config.logger){
        var Util = new Utils();
        if (config.debug){
            config.logger.debug(args)
        }else{
            config.logger.info(Util.ofuscate(args))
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
    str += sKey;

    args.psp_SecureHash = crypto.createHash('md5').update(str).digest('hex');

    return args; 
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


SoapClient.prototype.prepareRequest = function(args, config){
    var request = {};
    if (!args.psp_ClientSession){
        args = this.addSecureHash(args, config.secretKey);
    }

    args = this.addMerchantAdditionalDetails(args);
    
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
            SdkInfo: constants.LANGUAGE + ' ' + version.VERSION
        };
    } else {
        Object.assign(args.psp_MerchantAdditionalDetails, {SdkInfo: constants.LANGUAGE + ' ' + version.VERSION});
    }


    return args;
}

module.exports = SoapClient;