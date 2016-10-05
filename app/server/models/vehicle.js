var Db = require('mongodb').Db;
var server = require('mongodb').Server;

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
var dbMongoHost = "192.168.28.251";
var dbMongoPort = properties.get('bbdd.mongo.port');

var db = new Db(dbMongoName, new server(dbMongoHost, dbMongoPort));

// Crear un objeto para ir almacenando todo lo necesario
var vehicleModel = {};

vehicleModel.getVehicles = function(callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('VEHICLE');
        //collection.find().limit(100).toArray(function(err, docs) {
        collection.find().toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

vehicleModel.getVehicle = function(vehicleLicense, callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('VEHICLE');
        collection.find({"vehicle_license" : vehicleLicense}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = vehicleModel;