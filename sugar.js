
//**  There is a bug in Restler right now, DO NOT USE Node version > 0.10.x! **/
var rest = require("restler");
var baseUrl = "";

exports.init = function(url){
    console.log("init called");
    baseUrl = url;
};

exports.login = function(username, password, callback, context){
    console.log("login called");
    console.log(baseUrl);
    var jsonData = {
        "grant_type" : "password",
        "username" : username,
        "password" : password,
        "client_id" : "sugar",
        "client_secret" : ""
    };
    rest.postJson(baseUrl + '/oauth2/token', jsonData).on('complete', function(data, response) {
        console.log("login complete");
        console.log(data);
        var token = data.access_token;
        callback(token);
    });
};

exports.get = function(relativeUrl, token, callback){
    console.log("get called");
    rest.get(baseUrl + relativeUrl, { 
        headers:  { 
            "Content-Type" : "application/json",
            "OAuth-Token": token 
        }
    }).on('success', function(data, response) {
        callback(data, response);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};
