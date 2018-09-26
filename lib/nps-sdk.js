
var SoapClient = require('./soapClient')
var services = require('./services')
var constants = require('./constants')

var Sdk = function () {
    this.soapClient = null;
};

Sdk.prototype.getConstants = function(){
    return constants;
}

Sdk.prototype.connect = function(params){
    this.soapClient = new SoapClient(params)
}

Sdk.prototype.payOnline2p = function (params, callBack) {
    this.soapClient.callClient(services.PAY_ONLINE_2P, params, callBack);
}

Sdk.prototype.authorize2p = function (params, callBack) {
    this.soapClient.callClient(services.AUTHORIZE_2P, params, callBack);
}

Sdk.prototype.queryTxs = function (params, callBack) {
    this.soapClient.callClient(services.QUERY_TXS, params, callBack);
}

Sdk.prototype.simpleQueryTx = function (params, callBack) {
    this.soapClient.callClient(services.SIMPLE_QUERY_TX, params, callBack);
}

Sdk.prototype.refund = function (params, callBack) {
    this.soapClient.callClient(services.REFUND, params, callBack);
}

Sdk.prototype.capture = function (params, callBack) {
    this.soapClient.callClient(services.CAPTURE, params, callBack);
}

Sdk.prototype.authorize3p = function (params, callBack) {
    this.soapClient.callClient(services.AUTHORIZE_3P, params, callBack);
}

Sdk.prototype.bankPayment3p = function (params, callBack) {
    this.soapClient.callClient(services.BANK_PAYMENT_3P, params, callBack);
}

Sdk.prototype.bankPayment2p = function (params, callBack) {
    this.soapClient.callClient(services.BANK_PAYMENT_2P, params, callBack);
}

Sdk.prototype.cashPayment3p = function (params, callBack) {
    this.soapClient.callClient(services.CASH_PAYMENT_3P, params, callBack);
}

Sdk.prototype.changeSecretKey = function (params, callBack) {
    this.soapClient.callClient(services.CHANGE_SECRET_KEY, params, callBack);
}

Sdk.prototype.fraudScreening = function (params, callBack) {
    this.soapClient.callClient(services.FRAUD_SCREENING, params, callBack);
}

Sdk.prototype.notifyFraudScreeningReview = function (params, callBack) {
    this.soapClient.callClient(services.NOTIFY_FRAUD_SCREENING_REVIEW, params, callBack);
}

Sdk.prototype.payOnline3p = function (params, callBack) {
    this.soapClient.callClient(services.PAY_ONLINE_3P, params, callBack);
}

Sdk.prototype.splitAuthorize3p = function (params, callBack) {
    this.soapClient.callClient(services.SPLIT_AUTHORIZE_3P, params, callBack);
}

Sdk.prototype.splitPayOnline3p = function (params, callBack) {
    this.soapClient.callClient(services.SPLIT_PAY_ONLINE_3P, params, callBack);
}

Sdk.prototype.queryCardNumber = function (params, callBack) {
    this.soapClient.callClient(services.QUERY_CARD_NUMBER, params, callBack);
}

Sdk.prototype.getIinDetails = function (params, callBack) {
    this.soapClient.callClient(services.GET_IIN_DETAILS, params, callBack);
}

Sdk.prototype.createPaymentMethod = function (params, callBack) {
    this.soapClient.callClient(services.CREATE_PAYMENT_METHOD, params, callBack);
}

Sdk.prototype.createPaymentMethodFromPayment = function (params, callBack) {
    this.soapClient.callClient(services.CREATE_PAYMENT_METHOD_FROM_PAYMENT, params, callBack);
}

Sdk.prototype.retrievePaymentMethod = function (params, callBack) {
    this.soapClient.callClient(services.RETRIEVE_PAYMENT_METHOD, params, callBack);
}

Sdk.prototype.updatePaymentMethod = function (params, callBack) {
    this.soapClient.callClient(services.UPDATE_PAYMENT_METHOD, params, callBack);
}

Sdk.prototype.deletePaymentMethod = function (params, callBack) {
    this.soapClient.callClient(services.DELETE_PAYMENT_METHOD, params, callBack);
}

Sdk.prototype.createCustomer = function (params, callBack) {
    this.soapClient.callClient(services.CREATE_CUSTOMER, params, callBack);
}

Sdk.prototype.retrieveCustomer = function (params, callBack) {
    this.soapClient.callClient(services.RETRIEVE_CUSTOMER, params, callBack);
}

Sdk.prototype.updateCustomer = function (params, callBack) {
    this.soapClient.callClient(services.UPDATE_CUSTOMER, params, callBack);
}

Sdk.prototype.deleteCustomer = function (params, callBack) {
    this.soapClient.callClient(services.DELETE_CUSTOMER, params, callBack);
}

Sdk.prototype.recachePaymentMethodToken = function (params, callBack) {
    this.soapClient.callClient(services.RECACHE_PAYMENT_METHOD_TOKEN, params, callBack);
}

Sdk.prototype.createPaymentMethodToken = function (params, callBack) {
    this.soapClient.callClient(services.CREATE_PAYMENT_METHOD_TOKEN, params, callBack);
}

Sdk.prototype.retrievePaymentMethodToken = function (params, callBack) {
    this.soapClient.callClient(services.RETRIEVE_PAYMENT_METHOD_TOKEN, params, callBack);
}

Sdk.prototype.createClientSession = function (params, callBack) {
    this.soapClient.callClient(services.CREATE_CLIENT_SESSION, params, callBack);
}

Sdk.prototype.getInstallmentsOptions = function (params, callBack) {
    this.soapClient.callClient(services.GET_INSTALLMENTS_OPTIONS, params, callBack);
}

Sdk.prototype.splitPayOnline2p = function (params, callBack) {
    this.soapClient.callClient(services.SPLIT_PAY_ONLINE_2P, params, callBack);
}

Sdk.prototype.splitAuthorize2p = function (params, callBack) {
    this.soapClient.callClient(services.SPLIT_AUTHORIZE_2P, params, callBack);
}

Sdk.prototype.queryCardDetails = function (params, callBack) {
    this.soapClient.callClient(services.QUERY_CARD_DETAILS, params, callBack);
}

module.exports = Sdk;