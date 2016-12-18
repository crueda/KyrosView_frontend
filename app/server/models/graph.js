var server = require('mongodb').Server;
var mongoose = require('mongoose');
var crypt     = require('crypt3');

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
var graphModel = {};



graphModel.getGraphData = function(vehicleLicense, callback)
{
  function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
  }
  mongoose.connection.db.collection('ODOMETER', function (err, collection) {
      collection.find({'vehicle_license': vehicleLicense}).toArray(function(err, docs) {
          if (docs[0]!=undefined) {
            var events = [];
            for(var eventType in docs[0].eventTypeCounter) {
              //log.info(eventType + " - " + docs[0].eventTypeCounter[eventType]);
              events.push([eventType, docs[0].eventTypeCounter[eventType]]);
              events.sort(sortFunction);
              //log.info(events);
              docs[0].eventTypeOrdered = events;
            }
          } else {
            docs[0].eventTypeOrdered = [];

          }
          callback(null, docs);
      });
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = graphModel;
