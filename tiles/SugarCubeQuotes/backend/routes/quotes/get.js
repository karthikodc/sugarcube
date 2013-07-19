var jive = require("jive-sdk");
var http = require("http");

exports.route = function(req, res){
    var conf = jive.service.options;
    var quotes = "quote data";
    //Assumes Sugar7 is installed on port 80 of same machine running Dealroom server
    http.get(conf.clientUrl + "/sugarcrm/rest/v10/Quotes", function(getResp) {
    	//TODO Get Sugar7 OAuth token
	  	console.log("Got response: " + getResp.statusCode);
	  	getResp.on('data', function(chunk){
		    res.render('quotes.html', { 
		    	host: conf.clientUrl + ':' + conf.port, 
		    	quotes: chunk
		    });
	  	});
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
};