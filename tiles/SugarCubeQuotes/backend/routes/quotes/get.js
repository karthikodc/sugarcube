var jive = require("jive-sdk");
var http = require("http");
var sugar = require("../../../../../sugar.js");

var conf = jive.service.options;

exports.route = function(req, res){
    console.log("quotes route hit");
    sugar.login("jim", "jim", function(token){
        console.log("login success");
        console.log(token);
        sugar.get("/Quotes", token, function(data, response){
            console.log("rendering quotes");
            res.render('quotes.html', { 
                host: conf.clientUrl + ':' + conf.port, 
                quotes: JSON.stringify(data)
            });
        });
    });
};
