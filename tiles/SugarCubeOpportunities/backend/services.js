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
sugar.init(conf.clientUrl + "/sugarcrm/");


function processTileInstance(instance) {
    jive.logger.debug('running pusher for ', instance.name, 'instance', instance.id);

    var dataToPush = {
        data: {
            "title": "Opportunities",
            "contents": null,
            "config": {
                "listStyle": "contentList"
            },
            "action": {
                "url": conf.clientUrl + "/sugarcrm/#Opportunities/create",
                "text": "Create an Opportunity"
                // ,
                // "context": {
                //     "url": conf.clientUrl + "sugarcrm/#Opportunities/create",
                //     "mode": "add"
                // }
            }
        }
    };
    //TODO externalize credentials
    sugar.getAccessToken("jim", "jim", function(token){
        sugar.get("/Opportunities", token, function(data, response){
            if (typeof data.records  === 'undefined') return;
            var records = data.records;
            var items = [];
            if (records) {
                records.forEach(function(record){
                    items.push(
                    {
                        text: record.name,
                        icon: "https://si0.twimg.com/profile_images/2027721183/Sugar_cube_RGB_180x180_bigger.png",
                        linkDescription: record.description,
                        // action: sugar.getDisplayUrl(record._module, record.id),
                        url: sugar.getDisplayUrl(record._module, record.id),
                        action: {
                            url: sugar.getDisplayUrl(record._module, record.id)
                            // {
                            //     id: record.id, 
                            //     module: record._module
                            // }
                        }                        
                    });
                });
                dataToPush.data.contents = items;
            }
            jive.tiles.pushData(instance, dataToPush);
        }, 5);
    });

    
}

exports.task = new jive.tasks.build(
    // runnable
    function() {
        jive.tiles.findByDefinitionName( 'SugarCubeOpportunities' ).then( function(instances) {
            if ( instances ) {
                instances.forEach( function( instance ) {
                    processTileInstance(instance);
                });
            }
        });
    },

    // interval (optional)
    20000
);
