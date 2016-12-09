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
var iconModel = {};

iconModel.getIcon = function(id, callback)
{
  mongoose.connection.db.collection('ICON', function (err, collection) {
      collection.find({'_id': new ObjectId(id)}).toArray(function(err, docs) {
            callback(null, docs);
      });
  });
}

iconModel.getAllIconInfo = function(callback)
{
  mongoose.connection.db.collection('ICON', function (err, collection) {
      collection.find({},{'svg': 0}).toArray(function(err, docs) {
          callback(null, docs);
      });
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = iconModel;
