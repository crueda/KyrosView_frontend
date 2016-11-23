var express = require('express');
var router = express.Router();

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var UserModel = require('../models/user');

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

router.get('/app/user/:username', function(req, res)
{
  var username = req.params.username;
  var push_mode = req.query.push_mode;
  var group_mode = req.query.group_mode;
  
  log.info("GET: /app/user/"+username+"?push_mode="+push_mode+"&group_mode="+group_mode);
  UserModel.setUserPreferences(username, push_mode, group_mode, function(error, data) {
    if (data == null) {
      res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
    }
    else {
      //si existe enviamos el json
      if (typeof data !== 'undefined') {
        res.status(200).json(data)
      } else {
        res.status(202).json({"response": {"status":status.STATUS_NOT_FOUND_REGISTER,"description":messages.MISSING_REGISTER}})
      }
    }
  });
});

module.exports = router;
