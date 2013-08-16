var jive = require("jive-sdk");
var http = require("http");
var sugar = require("../../../../../sugar.js");

var conf = jive.service.options;

exports.route = function(req, res){
    sugar.getAccessToken("jim", "jim", function(token){
        sugar.get("/Quotes", token, function(data, response){
            res.send(JSON.stringify(data));
        });
    });
};

