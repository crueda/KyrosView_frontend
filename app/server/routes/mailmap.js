var express = require('express');
var router = express.Router();

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var MailmapModel = require('../models/mailmap');

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


router.get('/mailmap', function(req, res)
{
      var resourceId = req.query.resourceId;
      var deviceId = req.query.deviceId;
      log.info("GET: /mailmap?resourceId="+resourceId + "&deviceId=" + deviceId);

      MailmapModel.getPosition(resourceId, deviceId, function(error, data)
      {
          if (data == null) {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else {
              res.status(200).json(data)
          }
          
      }); 
});

module.exports = router;