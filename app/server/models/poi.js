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

mongoose.createConnection('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, function (error) {
    if (error) {
        log.info(error);
    }
});

// Crear un objeto para ir almacenando todo lo necesario
var poiModel = {};

poiModel.getPoisFromBox = function(boxData,callback)
{
    mongoose.connection.db.collection('POIS', function (err, collection) {
        log.info(boxData.ullon);
        log.info(boxData.ullat);
        log.info(boxData.drlon);
        log.info(boxData.drlat);
        //collection.find( { 'location' :{ $geoWithin :{ $box : [ [ parseFloat(boxData.ullon) , parseFloat(boxData.ullat) ] ,[ parseFloat(boxData.drlon) , parseFloat(boxData.drlat) ]]}}}).toArray(function(err, docs) {
        collection.find( { 'username': boxData.username, 'location' :{ $geoWithin :{ $box : [ [ parseFloat(boxData.ullon) , parseFloat(boxData.ullat) ] ,[ parseFloat(boxData.drlon) , parseFloat(boxData.drlat) ]]}}}).toArray(function(err, docs) {
            log.info(docs);
            callback(null, docs);
        });
    });
}

poiModel.getPoisFromRadio = function(username,lat, lon, radio, callback)
{
    mongoose.connection.db.collection('POIS', function (err, collection) {
        collection.find({'username': username, 'location': {$near: { $geometry: { type: "Point" , coordinates: [ parseFloat(lon) , parseFloat(lat) ]}, $maxDistance: parseInt(radio)}}}).toArray(function(err, docs) {
            callback(null, docs);
        });
    });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = poiModel;

