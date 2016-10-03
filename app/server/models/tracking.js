var Db = require('mongodb').Db;
var server = require('mongodb').Server;
var moment = require('moment');

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
var trackingModel = {};

trackingModel.getTracking1FromUser = function(username,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking1');
        //var current_time = new moment ().format("HH:mm:ss.S");
        //console.log("--> " + current_time);
        collection.find({'monitor': username}).toArray(function(err, docs) {
            //var current_time = new moment ().format("HH:mm:ss.S");
            //console.log("--> " + current_time);
            callback(null, docs);
        });
    }
  });
}

trackingModel.getTracking1FromDeviceId = function(deviceId,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking1').sort({"pos_date": -1});
        collection.find({'deviceId': parseInt(deviceId)}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

trackingModel.getTracking1FromDevices = function(deviceIdList,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {

        log.info(deviceIdList);
        deviceIdList_array = deviceIdList.split(",");
        for (i=0; i<deviceIdList_array.length; i++)
            deviceIdList_array[i] = parseInt(deviceIdList_array[i]);
        log.info(deviceIdList_array);
        var collection = db.collection('tracking1');
        collection.find({'deviceId': {$in: deviceIdList_array}}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}


trackingModel.getTracking5FromDeviceId = function(deviceId,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking5');
        collection.find({'deviceId': parseInt(deviceId)}).sort({"pos_date": -1}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

trackingModel.getTrackingFromDeviceId = function(requestData,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking');
        collection.find({'deviceId': parseInt(requestData.deviceId), 'pos_date': {$gt: parseInt(requestData.initDate), $lt: parseInt(requestData.endDate)}}).sort({'pos_date': 1}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

trackingModel.getTracking = function(id,callback)
{
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking');
        collection.find({'_id': parseInt(id)}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

trackingModel.getHeatmap = function(requestData,callback)
{   
  db.open(function(err, db) {
    if(err) {
        callback(err, null);
    }
    else {
        var collection = db.collection('tracking');
        collection.find({'_id': parseInt(id)}).toArray(function(err, docs) {
            callback(null, docs);
        });
    }
  });
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = trackingModel;

