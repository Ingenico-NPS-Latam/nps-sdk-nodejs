var soap = require('soap')
var crypto = require('crypto');
var constants = require('./constants')
var Utils = require('./utils')

var SoapClient = function (config) {
    this.config = config;
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

SoapClient.prototype.callClient = function (service, params, callback) {
    var localConfig = this.config;
    var log = this.log;
    var prepareResponse = this.prepareResponse
    var Util = new Utils();
    var wsdl = Util.getWSDL(localConfig.environment)
    params = this.prepareRequest(params, localConfig);
    soap.createClient(wsdl, {disableCache: true}, function handleRequest(err, client) {        
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
        options["proxy"] = localConfig.proxy 
        
        client[service](params, function handleResponse(error, response) {
            log(client.lastRequest, localConfig)
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
        if (typeof args[keys[i]] != 'object') {
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


    
    return args;
};

SoapClient.prototype.addMerchantAdditionalDetails = function(args){
    args.psp_MerchantAdditionalDetails = {
        SdkInfo: constants.LANGUAGE + ' ' + constants.VERSION
    };
    return args;
}

module.exports = SoapClient;