
/**
 * (Rough beginnings of a) Sugar REST API node.js module
 *
 */
var http = require("http");
var url = require("url");
var baseUrl = ""; 
var restUrl = "";
var tokenStore = {};

exports.init = function(url){
    console.log("init called");
    baseUrl = url;
    restUrl = baseUrl + "rest/v10";
};

exports.getDisplayUrl = function(module, id){
    return baseUrl + "#" + module + "/" + id;
};

exports.getAccessToken = function(username, password, callback, context){
    //Use cached credentials if we can
    if (tokenStore[username]) {
        callback(tokenStore[username].access_token);
        return;
    }
    console.log("getAccessToken called");
    console.log(restUrl);
    var jsonData = {
        "grant_type" : "password",
        "username" : username,
        "password" : password,
        "client_id" : "sugar",
        "client_secret" : ""
    };
    var options = url.parse(restUrl + '/oauth2/token');
    options.headers = {
        'Accept' : 'application/json',
        'Content-Type' :'application/json'    
    };
    options.method = 'POST';
    var req = http.request(options, function(response){
        if (response.statusCode != 200) {
            console.error("Login failed: " + response.statusCode);
        }
        response.setEncoding('utf8');
        response.on('data', function(chunk){
            var data = JSON.parse(chunk.toString());
            tokenStore[username] = data;
            //reset when access token expires
            setTimeout(function(){
                delete tokenStore[username];
            }, data.expires_in * 1000);  
            callback(tokenStore[username].access_token);
        });
        
    }).on('error', function(e){
        console.error("Login error: " + e.message);
    });
    req.write(JSON.stringify(jsonData))
    req.end();
};

exports.get = function(relativeUrl, token, callback, max_num){
    console.log("get called for " + relativeUrl);
    var options = url.parse(restUrl + relativeUrl);
    var buffer = "";
    options.headers = { 
        "Content-Type" : "application/json",
        "OAuth-Token": token 
    };
    if (typeof max_num === 'number') {
        options.path = options.path + "?max_num=" + max_num;   
    }
    http.get(options, function(response) {
        if (response.statusCode != 200) {
            console.error("Login failed: " + response.statusCode);
        }
        response.setEncoding('utf8');
        response.on('data', function(chunk){
            buffer += chunk.toString();
        }); 
        response.on('end', function(){
            var data = JSON.parse(buffer);
            callback(data, response);
        });
    }).on('error', function(e) {
        console.error("Got error: " + e.message);
    });
};
