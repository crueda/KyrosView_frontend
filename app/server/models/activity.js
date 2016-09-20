var Db = require('mongodb').Db;
var server = require('mongodb').Server;
var moment = require('moment');
var jsonfy = require('jsonfy');

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

// Definición del log
var fs = require('fs');
var log = require('tracer').console({
    transport : function(data) {
        //console.log(data.output);
        fs.open(properties.get('main.log.file'), 'a', 0666, function(e, id) {
            fs.write(id, data.output+"\n", null, 'utf8', function() {
                fs.close(id, function() {
                });
            });
        });
    }
});

var dbMongoName = properties.get('bbdd.mongo.name');
var dbMongoHost = properties.get('bbdd.mongo.ip');
var dbMongoPort = properties.get('bbdd.mongo.port');

var db = new Db(dbMongoName, new server(dbMongoHost, dbMongoPort));


// Crear un objeto para ir almacenando todo lo necesario
var activityModel = {};

activityModel.getActivity = function(requestData,callback)
{
    db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking');
        collection.find({'deviceId': parseInt(requestData.deviceId), 'pos_date': {$gt: parseInt(requestData.initDate)}}).sort({'pos_date': 1}).toArray(function(err, docs) {
            var jsondocs = jsonfy(JSON.stringify(docs)); 

            var json_graphs = {"datasets": 
                [
                    {
                        "type": "line", "valueDecimals": 1, 
                        "name": "Velocidad", "unit": "km/h",
                        "data": []
                    }, 
                    {
                        "type": "area", "valueDecimals": 0, 
                        "name": "Altitud", "unit": "m",
                        "data": []
                    },
                    {
                        "type": "area", "valueDecimals": 0,                 
                        "name": "Distancia", "unit": "m",
                        "data": []
                    }
                ],
                "xData": []
            }

            var total_distance = 0;
            for (item in jsondocs) {
                json_graphs.datasets[0].data.push(jsondocs[item].speed);
                json_graphs.datasets[1].data.push(jsondocs[item].altitude);
                json_graphs.datasets[2].data.push(total_distance);
                json_graphs.xData.push(jsondocs[item].pos_date);

                total_distance = total_distance + jsondocs[item].distance;
            }
            //console.log(json_graphs);
            callback(null, JSON.stringify(json_graphs));
        });
    }
  });
}

activityModel.getActivityWithHR = function(requestData,callback)
{
    db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking');
        collection.find({'deviceId': parseInt(requestData.deviceId), 'pos_date': {$gt: parseInt(requestData.initDate)}}).sort({'pos_date': 1}).toArray(function(err, docs) {
            var jsondocs = jsonfy(JSON.stringify(docs)); 

            var json_graphs = {"datasets": 
                [
                    {
                        "type": "line", "valueDecimals": 1, 
                        "name": "Velocidad", "unit": "km/h",
                        "data": []
                    }, 
                    {
                        "type": "area", "valueDecimals": 0, 
                        "name": "Altitud", "unit": "m",
                        "data": []
                    },
                    {
                        "type": "area", "valueDecimals": 0,                 
                        "name": "Distancia", "unit": "m",
                        "data": []
                    },
                    {
                        "type": "area", "valueDecimals": 0,                 
                        "name": "Ritmo cardiaco", "unit": "bpm",
                        "data": []
                    }
                ],
                "xData": []
            }

            var total_distance = 0;
            for (item in jsondocs) {
                json_graphs.datasets[0].data.push(jsondocs[item].speed);
                json_graphs.datasets[1].data.push(jsondocs[item].altitude);
                json_graphs.datasets[2].data.push(total_distance);
                json_graphs.datasets[3].data.push(jsondocs[item].heading);
                json_graphs.xData.push(jsondocs[item].pos_date);

                total_distance = total_distance + jsondocs[item].distance;
            }

            callback(null, JSON.stringify(json_graphs));
        });
    }
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = activityModel;

