var fs = require('fs')
var ini = require('ini')

var Utils = function(){
    this.sanitize_config = ini.parse(fs.readFileSync(__dirname + '/struc/sanitize_struc.ini', 'utf-8'))
}


Utils.prototype.getWSDL = function(env){
	return __dirname + '/wsdl/' + env;
}

Utils.prototype.sanitize = function(params, is_root, nodo){
		if (is_root){
			var result_params = {}
		}else{
	        result_params = params
		}
        for(var k in params) {
  			var v = params[k];
            if (typeof(v) == 'object'){
                
  				if (v.length == undefined){
                    result_params[k] = this.sanitize(v, false, k);
  				}else{
  					result_params[k] = this.sanitizeArray(v, k);
  					
  				}
  			}else{
	            result_params[k] = this.validateSize(v, k, nodo);
  			}
              
  		}
        
        return result_params

	}	

Utils.prototype.validateSize = function(value, k, nodo){
    if (nodo != null){
        key_name = nodo + "." + k + ".max_length"
    }else{
        key_name = k + ".max_length"
    }
    size = this.sanitize_config[key_name];
    
    if (size != undefined){
        value = value.slice(0, size);
    }

    return value
}


Utils.prototype.sanitizeArray = function(v, nodo){
    var result_params = [];
    for (var x in v){
        result_params.push(this.sanitize(x, false, nodo));
    }
    return result_params
}

Utils.prototype.ofuscateCardNumber = function(data){
		var replacedData = data.replace(
			/>\d{13,19}<\/psp_CardNumber>/g, 
			function wrapCardNumberlabel(cNumberWLabel)
				{
					return cNumberWLabel.replace(/\d{13,19}/, function wrapCardNumber(cNumber){
						var cNumberBegin = cNumber.slice(0,6);
						var cNumberEnd = cNumber.slice(-4);
						var cNumberLen = cNumber.length;
						return cNumberBegin + "*".repeat(cNumberLen-10) + cNumberEnd;
					})
				}
			);
		return replacedData;
	}


Utils.prototype.ofuscateExpDate = function(data){
		var replacedData = data.replace(
			/>\d{4}<\/psp_CardExpDate>/g, 
			function wrapExpDatelabel(expDateLabel)
				{
					return expDateLabel.replace(/\d{4}/, function wrapExpDate(expDate){
						return "*".repeat(expDate.length);
					})
				}
			);
		return replacedData;
	}

Utils.prototype.ofuscateCVC = function (data){
		var replacedData = data.replace(
				/>\d{3,4}<\/psp_CardSecurityCode>/g, 
			function wrapCardSecCodeLabel(cardSecCodeLabel)
				{
					return cardSecCodeLabel.replace(/\d{3,4}/, function wrapCardSecCode(secCode){
						return "*".repeat(secCode.length);
					})
				}
			);
		return replacedData;
	}

Utils.prototype.ofuscate = function(data){
		data = this.ofuscateCVC(data)
		data = this.ofuscateCardNumber(data)
		data = this.ofuscateExpDate(data)
		return data;
	}






module.exports = Utils;