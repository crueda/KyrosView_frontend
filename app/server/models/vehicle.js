var server = require('mongodb').Server;
var mongoose = require('mongoose');

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

mongoose.connect('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, function (error) {
    if (error) {
        log.info(error);
    }
});

// Crear un objeto para ir almacenando todo lo necesario
var vehicleModel = {};

vehicleModel.getVehicles = function(callback)
{
    mongoose.connection.db.collection('VEHICLE', function (err, collection) {
        collection.find().toArray(function(err, docs) {
            callback(null, docs);
        });
    });

}

vehicleModel.getVehicle = function(vehicleLicense, callback)
{
    mongoose.connection.db.collection('VEHICLE', function (err, collection) {
        collection.find({"vehicle_license" : vehicleLicense}).toArray(function(err, docs) {
            callback(null, docs);
        });
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = vehicleModel;
