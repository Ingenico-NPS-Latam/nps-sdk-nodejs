#  Node.js SDK
 

## Availability
Supports Node.Js v4.2.0 and above


## How to install

```
npm install nps_sdk
```

## Configuration

It's a basic configuration of the SDK

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
});
```



Here is an simple example request:

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   cache: true});

Sdk.payOnline2p({
        psp_Version: '2.2',
        psp_MerchantId: 'psp_test',
        psp_TxSource: 'WEB',
        psp_MerchTxRef: 'ORDER66666-2',
        psp_MerchOrderId: 'ORDER66666',
        psp_Amount: '15050',
        psp_NumPayments: '1',
        psp_Currency: '032',
        psp_Country: 'ARG',
        psp_Product: '14',
        psp_CardNumber: '4507990000000010',
        psp_CardExpDate: '1612',
        psp_CardSecurityCode: '123',
        psp_PosDateTime: '2016-12-01 12:00:00'
    },
    function (error, response) {
        if (error) {
            console.log(error) //Http Error
        } else {
            // Code to handle response
        }
    });
```

## Environments

```javascript
var constants = require('./lib/constants')

constants.SANDBOX
constants.STAGING
constants.PRODUCTION
```

## Error handling

The HTTP errors that can occur inside of SDK will be returned inside of the error variable provided by your callback function

Note: The rest of the exceptions that can occur will be detailed inside of the response provided by NPS.

```javascript
var Sdk = new Sdk(conf);

Sdk.payOnline2p({
        parameters: "params"
    },
    function (error, response) {
        if (error) {
            console.log(error) 
        } else {
            //Code to handle the response
        }
    });
```

## Advanced configurations

### Logging

Nps SDK allows you to log what’s happening with you request inside of our SDK.
The SDK uses the custom logger that you use for your project.

```javascript
var winston = require('winston');
var Sdk = require('nps_sdk');
var sdk = new Sdk();

const wLogger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   logger: logger});
```

### LogLevel

The "INFO" level will write concise information of the request and will mask sensitive data of the request. 
The "DEBUG" level will write information about the request to let developers debug it in a more detailed way.

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   logLevel: DEBUG});
```

### Sanitize

Sanitize allows the SDK to truncate to a fixed size some fields that could make request fail, like extremely long name.

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   sanitize: true});
```

### Timeout

You can change the timeout of the request (Milliseconds).

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   timeout: 60000});
```

### Proxy configuration

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   proxyUrl: '_YOUR_PROXY_URL_'});
```

### Cache

```javascript
var Sdk = require('nps_sdk');
var sdk = new Sdk();

var constants = sdk.getConstants();

sdk.connect({environment: constants.SANDBOX,
   secretKey: 'YOUR_SECRET_KEY',
   cache: true});
```
