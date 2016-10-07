var Db = require('mongodb').Db;
var server = require('mongodb').Server;

var jsonfy = require('jsonfy');
var flatten = require('flat');
var unflatten = require('flat').unflatten;

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
var monitorModel = {};

monitorModel.getMonitorFromUser = function(username,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('MONITOR');
        collection.find({'username': username}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}



monitorModel.setMonitorCheckedFromUser = function(requestData,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('MONITOR');
        collection.find({'username': requestData.username}).toArray(function(err, docs) {
            var jsondocs = jsonfy(JSON.stringify(docs)); 
            delete jsondocs[0]['_id']; 
            log.info (jsondocs);
            flat_monitor = flatten(jsondocs);

            var keys = Object.keys( flat_monitor );
            for( var i = 0,length = keys.length; i < length; i++ ) {
                log.info (keys[i] + " - " + flat_monitor[ keys[ i ] ]);
                if (keys[i].indexOf("checked")!=-1) {
                    flat_monitor[ keys[ i ]] = "true";
                }

            }

            var u = unflatten(flat_monitor);
            collection.remove({"username": requestData.username}, function(err, result) {
            if (err) {
                callback(null, null);
            } else {            
                collection.save(u['0']);
                db.close();
                callback(null, docs);
            }

            });

        });
    }
  });
}


//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = monitorModel;
