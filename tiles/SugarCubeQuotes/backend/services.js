/*
 * Copyright 2013 Jive Software
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

var count = 0;
var jive = require("jive-sdk");

// Setup Sugar7 connection
var sugar = require("../../../sugar.js");
var conf = jive.service.options;
//Assumes Sugar7 is installed on port 80 of same machine running Dealroom server
var baseurl = conf.clientUrl + "/sugarcrm/rest/v10";
sugar.init(baseurl);


function processTileInstance(instance) {
    jive.logger.debug('running pusher for ', instance.name, 'instance', instance.id);

    var dataToPush = {
        data: {
            "title": "Quotes",
            "contents": null,
            "config": {
                "listStyle": "contentList"
            },
            "action": {
                "text": "Create a Quote",
                "context": {
                    "mode": "add"
                }
            }
        }
    };
    //TODO externalize credentials
    sugar.getAccessToken("jim", "jim", function(token){
        sugar.get("/Quotes", token, function(data, response){
            if (typeof data.records  === 'undefined') return;
            var records = data.records;
            var items = [];
            if (records) {
                records.forEach(function(record){
                    items.push(
                    {
                        text: record.name,
                        icon: "http://farm4.staticflickr.com/3136/5870956230_2d272d31fd_z.jpg",
                        linkDescription: record.description,
                        action: {
                            context: {
                                id: record.id, 
                                module: record._module
                            }
                        }                        
                    });
                });
                dataToPush.data.contents = items;
            }
            jive.tiles.pushData(instance, dataToPush);
        });
    });

    
}

exports.task = new jive.tasks.build(
    // runnable
    function() {
        jive.tiles.findByDefinitionName( 'SugarCubeQuotes' ).then( function(instances) {
            if ( instances ) {
                instances.forEach( function( instance ) {
                    processTileInstance(instance);
                });
            }
        });
    },

    // interval (optional)
    15000
);
