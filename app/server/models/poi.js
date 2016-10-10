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
var dbMongoPort = properties.get('bbdd.mongo.port');

var db = new Db(dbMongoName, new server(dbMongoHost, dbMongoPort));


// Crear un objeto para ir almacenando todo lo necesario
var poiModel = {};

poiModel.getPoisFromBox = function(boxData,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('POIS');
        collection.find( { 'monitor': boxData.username, 'location' :{ $geoWithin :{ $box : [ [ parseFloat(boxData.ullon) , parseFloat(boxData.ullat) ] ,[ parseFloat(boxData.drlon) , parseFloat(boxData.drlat) ]]}}}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = poiModel;

