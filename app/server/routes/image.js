var express = require('express');
var router = express.Router();
var jsonfy = require('jsonfy');
var multer  =   require('multer');

var Busboy = require('busboy'); // 0.2.9
var mongo = require('mongodb'); // 2.0.31
var Grid = require('gridfs-stream'); // 1.1.1"

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var ImageModel = require('../models/image');

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


router.get('/image/device/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;

      log.info("GET: /image/device/"+deviceId);

      if (deviceId==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      } 
      else {
        ImageModel.getImageDevice(deviceId, function(error, data)
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

var db = new mongo.Db('kyros', new mongo.Server('192.168.28.251', 27017));
var gfs;
db.open(function(err, db) {
  if (err) throw err;
  gfs = Grid(db, mongo);
});

router.post('/image/upload/:deviceId', function(req, res)
{
  if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;

      log.info("POST: /image/upload");

      if (deviceId==null) {
          res.redirect('/map');
          //res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      } 
      else {
        // Borrar los ficheros antiguos
        gfs.files.remove({filename:deviceId} , function(err){
          if (err){
            log.error("error al borrar los ficheros antiguos");
          }else{
            log.debug("old file removed")
          }           
        }); 

        var busboy = new Busboy({ headers : req.headers });
        var fileId = new mongo.ObjectId();

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          console.log('got file', deviceId, mimetype, encoding);
          var writeStream = gfs.createWriteStream({
            _id: fileId,
            filename: deviceId,
            mode: 'w',
            content_type: mimetype,
          });
          file.pipe(writeStream);
        }).on('finish', function() {
          res.redirect('/map');
        });

        req.pipe(busboy);
      }
    }
});



module.exports = router;