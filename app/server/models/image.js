var server = require('mongodb').Server;
var jsonfy = require('jsonfy');

var fs = require('fs');
var mongo = require('mongodb');
var Grid = require('gridfs');

var Db = require('mongodb').Db;
var server = require('mongodb').Server;
var GridStore = require('mongodb').GridStore;

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
var imageModel = {};

imageModel.getImageDevice = function(deviceId,callback)
{

    db.open(function(err, db) {



var gridStore = new GridStore(db, "13.png", "r").open(function(err, gridStore) {

    gridStore.read(function(err, data) {
    //console.log(data);
    //console.log(data.toString('base64'));
    callback(null, data.toString('base64'));
    });

});



    });


//callback(null, File);


}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = imageModel;

