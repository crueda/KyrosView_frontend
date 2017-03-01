var server = require('mongodb').Server;
var mongoose = require('mongoose');
var moment = require('moment');
var crypto = require('crypto');

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


//mongoose.connect('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, function (error) {
mongoose.createConnection('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, { server: { reconnectTries: 3, poolSize: 5 } }, function (error) {
    if (error) {
        log.info(error);
    }
});

// Crear un objeto para ir almacenando todo lo necesario
var mailmapModel = {};

mailmapModel.getPosition = function(resourceId, deviceId, callback)
{

    try {
        var encryption_key = "n4r4nj1t0";
        //var ciphertext = "VJxlVt5wzdGaHmxgHQ2V7g==";

        var decipher = crypto.createDecipher('aes-128-ecb', encryption_key);
        decipher.setAutoPadding(false);
        var trackingId = decipher.update(resourceId, 'base64', 'utf8');

        mongoose.connection.db.collection('VEHICLE', function (err, collection) {
            collection.find({"device_id" : parseInt(deviceId)}).toArray(function(err, docsVehicle) {
                if (docsVehicle.length==0) {
                    callback(null, {result: "nok", data: "notfound"});                
                } else{
                    mongoose.connection.db.collection('TRACKING_' + docsVehicle[0].vehicle_license, function (err, collection) {
                        collection.find({"tracking_id": parseInt(trackingId)}).toArray(function(err, docsTracking) {
                            if (docsTracking.length==0) {
                                callback(null, {result: "nok", data: "notfound"});                
                            } else {
                                callback(null, {result: "ok", data: {vehicle: docsVehicle, tracking: docsTracking}});                            }
                        });
                    });
                }
            });                    
        });                 

    } catch (err) {
        callback(null, {result: "nok", data: "notfound"});                
    }   
        
}


//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = mailmapModel;

        