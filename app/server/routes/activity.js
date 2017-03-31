var express = require('express');
var router = express.Router();
var jsonfy = require('jsonfy');
var moment = require('moment');

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var ActivityModel = require('../models/activity');

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


router.get('/activity/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;
      var initDate = req.query.initDate;
      var endDate = req.query.endDate;

      log.info("GET: /activity/"+deviceId);

      if (endDate==null) {
        endDate = (new Date).getTime()
      }

      if (initDate==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      } 
      else {
        var requestData = {
          deviceId : deviceId,
          initDate : initDate,
          endDate : endDate
        };
        ActivityModel.getActivity(requestData, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined' && data.length > 0)
            {
              res.status(200).json(jsonfy(data))
            }
            else if (typeof data == 'undefined' || data.length == 0)
            {
              res.status(200).json([])
            }
            //en otro caso mostramos un error
            else
            {
              res.status(202).json({"response": {"status":status.STATUS_NOT_FOUND_REGISTER,"description":messages.MISSING_REGISTER}})
            }
          }
        }); 
      }   
    }
});

module.exports = router;