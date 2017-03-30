var server = require('mongodb').Server;
var mongoose = require('mongoose');

var moment = require('moment');

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

// Definición del log
var fs = require('fs');
var log = require('tracer').console({
    transport : function(data) {
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

mongoose.createConnection('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, { server: { reconnectTries: 3, poolSize: 5 } }, function (error) {
    if (error) {
        log.info(error);
    }
});

var odometerModel = {};

odometerModel.getOdometerData = function(deviceId,callback)
{
    mongoose.connection.db.collection('ODOMETER', function (err, collection) {
        collection.find({'device_id': parseInt(deviceId)}).toArray(function(err, docs) {
            callback(null, docs);
        });
    });

}

module.exports = odometerModel;

