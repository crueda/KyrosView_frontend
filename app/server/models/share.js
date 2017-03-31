var mongoose = require('mongoose');
var uuid = require('node-uuid');
var moment = require('moment');
var EM = require('../modules/email-dispatcher');

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

mongoose.connect('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName,  { server: { reconnectTries: 3, poolSize: 5 } }, function (error) {
  if (error) {
    log.info(error);
  }
});


// Crear un objeto para ir almacenando todo lo necesario
var shareModel = {};

shareModel.addSharing = function(requestData, callback)
{
  mongoose.connection.db.collection('VEHICLE', function (err, collection) {
    collection.find({'vehicle_license': requestData.vehicleLicense}).toArray(function(err, docsVehicle) {
                
        if (docsVehicle.length>0) {
            mongoose.connection.db.collection('SHARE', function (err, collectionShare) {

                    var timestamp = (new Date).getTime();
                    var expiration = timestamp + 86400000;
                    var uuid1 = uuid.v1();

                    var shareCollection = {
                        vehicle_license: requestData.vehicleLicense,
                        device_id: docsVehicle[0].device_id,
                        email: requestData.email,
                        username: requestData.username,
                        timestamp: timestamp,
                        expiration: expiration,
                        icon_real_time: docsVehicle[0].icon_real_time,
                        icon_cover: docsVehicle[0].icon_cover,
                        icon_alarm: docsVehicle[0].icon_alarm,
                        alias: docsVehicle[0].alias,
                        uuid: uuid1

                    }
                    collectionShare.save(shareCollection);
                    
                    // enviar mail
                    EM.dispatchShareVehicleLink(shareCollection, function(e, m){
                        if (m!=null){
                            callback(null, "ok");
                        }   else{
                            callback(null, "nok");
                        }
                    });
            });
        } else {
            callback(null, "nok");
        }
    });
  });
}


//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = shareModel;

