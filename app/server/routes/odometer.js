var express = require('express');
var router = express.Router();

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var OdometerModel = require('../models/odometer');

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

/**
 * @api {get} /api/odometer/:deviceId Odometro de un dispositivo 
 * @apiName GetOdometerDeviceId Obtener información de odometro de un dispositivo
 * @apiGroup Odometer
 * @apiDescription Datos de odometro de un dispositivo
 * @apiVersion 1.0.1
 * @apiSampleRequest http://view.kyroslbs.com/api/odometer/653
 *
 * @apiParam {Number} deviceId Identificador del dispositivo en Kyros
 *
 * @apiSuccess {json} odometerData Datos de odometro
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [{"_id":399,
 *        "deviceId":399,
 *        "dayConsume":0.1,
 *        "monthConsume":0.1,
 *        "monthDistance":5.8,
 *        "weekConsume":0.1,
 *        "dayDistance":5.8,
 *        "monthSpeed":24.68,
 *        "weekSpeed":24.68,
 *        "weekDistance":5.8,
 *        "daySpeed":24.68
 *        }]
 *     }
 */
router.get('/odometer/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;
      log.info("GET: /odometer/"+deviceId);

      OdometerModel.getOdometerData(deviceId,function(error, data)
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
            res.status(200).json(data)
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
});


module.exports = router;