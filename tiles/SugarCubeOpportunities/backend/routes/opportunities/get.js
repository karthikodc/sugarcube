var jive = require("jive-sdk");
var http = require("http");
var sugar = require("../../../../../sugar.js");

var conf = jive.service.options;

exports.route = function(req, res){
    sugar.getAccessToken("jim", "jim", function(token){
        sugar.get("/Opportunities", token, function(data){
            res.send(JSON.stringify(data));
        });
    });
};
