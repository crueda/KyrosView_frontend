var express = require('express');
var router = express.Router();

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var TrackingModel = require('../models/tracking');

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
 * @api {get} /api/tracking1/user/:username Últimas posiciones de los dispositivos de un username
 * @apiName GetTracking1User Obtener información de último tracking de todos los dispositivos de un usuario
 * @apiGroup Tracking
 * @apiDescription Datos del último tracking para todos los dispositivos monitorizados por el usuario
 * @apiVersion 1.0.1
 * @apiSampleRequest http://view.kyroslbs.com/api/tracking1/user/crueda
 *
 * @apiParam {String} username Nombre de usuario en Kyros
 *
 * @apiSuccess {json} trackingData Datos de último tracking
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [{"_id":399,
 *        "deviceId":399,
 *        "longitude":-4.72811,
 *        "latitude":41.6283,
 *        "speed":21.1,
 *        "heading":0,
 *        "pos_date":1346336184000,
 *        "iconReal":"truck.png",
 *        "iconCover":"truck_cover.png",
 *        "iconAlarm":"truck_alarm.png",
 *        "monitor":["flaa","crueda"],
 *        "license":"Bici_Rohm",
 *        "alias":"Bici rohm",
 *        "vehicle_state":"0"
 *        }]
 *     }
 */
router.get('/tracking1/user/:username', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var username = req.params.username;
      log.info("GET: /tracking1/user/"+username);

      TrackingModel.getTracking1FromUser(username,function(error, data)
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

/**
 * @api {get} /api/tracking1/device/:deviceId Última posición de un dispositivo
 * @apiName GetTracking1DeviceId Obtener información de último tracking de un dispositivo
 * @apiGroup Tracking
 * @apiDescription Datos del último tracking de un dispositivo
 * @apiVersion 1.0.1
 * @apiSampleRequest http://view.kyroslbs.com/api/tracking1/653/deviceId
 *
 * @apiParam {Number} deviceId Identificador del dispositivo en Kyros
 *
 * @apiSuccess {json} trackingData Datos de último tracking
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [{"_id":399,
 *        "deviceId":399,
 *        "longitude":-4.72811,
 *        "latitude":41.6283,
 *        "speed":21.1,
 *        "heading":0,
 *        "pos_date":1346336184000,
 *        "iconReal":"truck.png",
 *        "iconCover":"truck_cover.png",
 *        "iconAlarm":"truck_alarm.png",
 *        "monitor":["flaa","crueda"],
 *        "license":"Bici_Rohm",
 *        "alias":"Bici rohm",
 *        "vehicle_state":"0"
 *        }]
 *     }
 */
router.get('/tracking1/device/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;
      log.info("GET: /tracking1/device/"+deviceId);

      TrackingModel.getTracking1FromDeviceId(deviceId,function(error, data)
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

/**
 * @api {get} /api/tracking5/device/:deviceId Últimas 5 posiciones de un dispositivo
 * @apiName GetTracking5DeviceId Obtener información los últimos 5 tracking de un dispositivo
 * @apiGroup Tracking
 * @apiDescription Datos de los últimos 5 puntos de tracking de un dispositivo
 * @apiVersion 1.0.1
 * @apiSampleRequest http://view.kyroslbs.com/api/tracking5/device/653
 *
 * @apiParam {Number} deviceId Identificador del dispositivo en Kyros
 *
 * @apiSuccess {json} trackingData Datos de los últimos puntos de tracking
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [{"_id":399,
 *        "deviceId":399,
 *        "longitude":-4.72811,
 *        "latitude":41.6283,
 *        "speed":21.1,
 *        "heading":0,
 *        "pos_date":1346336184000,
 *        "license":"Bici_Rohm",
 *        "alias":"Bici rohm",
 *        "vehicle_state":"0"
 *        }......]
 *     }
 */
router.get('/tracking5/device/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;
      log.info("GET: /tracking5/device/"+deviceId);

      TrackingModel.getTracking5FromDeviceId(deviceId,function(error, data)
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

/**
 * @api {get} /api/tracking/device/:deviceId Posiciones de un dispositivo
 * @apiName GetTrackingDeviceId Obtener información de último tracking de un dispositivo
 * @apiGroup Tracking
 * @apiDescription Datos del último tracking de un dispositivo
 * @apiVersion 1.0.1
 * @apiSampleRequest http://view.kyroslbs.com/api/tracking/device/655?initDate=1473829136000&endDate=1473915536000
 *
 * @apiParam {Number} deviceId Identificador del dispositivo en Kyros
 * @apiParam {Number} initDate Fecha inicial (epoch)
 * @apiParam {Number} endDate Fecha final (epoch)
 *
 * @apiSuccess {json} trackingData Datos de todos los puntos de tracking entre esas fechas
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [{"_id":399,
 *        "deviceId":399,
 *        "longitude":-4.72811,
 *        "latitude":41.6283,
 *        "speed":21.1,
 *        "heading":0,
 *        "pos_date":1346336184000,
 *        "iconReal":"truck.png",
 *        "iconCover":"truck_cover.png",
 *        "iconAlarm":"truck_alarm.png",
 *        "monitor":["flaa","crueda"],
 *        "license":"Bici_Rohm",
 *        "alias":"Bici rohm",
 *        "vehicle_state":"0"
 *        }]
 *     }
 */
router.get('/tracking/device/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var deviceId = req.params.deviceId;
      var initDate = req.query.initDate;
      var endDate = req.query.endDate;

      log.info("GET: /tracking/device/"+deviceId);

      if (initDate==null || endDate==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      } 
      else {
        var requestData = {
          deviceId : deviceId,
          initDate : initDate,
          endDate : endDate
        };
        TrackingModel.getTrackingFromDeviceId(requestData, function(error, data)
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
    }
});

/**
 * @api {get} /api/tracking/:id Información de una posición
 * @apiName GetTracking Obtener información de una posición
 * @apiGroup Tracking
 * @apiDescription Datos de la posición de un dispositivo
 * @apiVersion 1.0.1
 * @apiSampleRequest http://view.kyroslbs.com/api/tracking/35635027
 *
 * @apiParam {Number} trackingId Identificador de la posición
 *
 * @apiSuccess {json} trackingData Datos del punto de tracking
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [{"_id":399,
 *        "deviceId":399,
 *        "longitude":-4.72811,
 *        "latitude":41.6283,
 *        "speed":21.1,
 *        "heading":0,
 *        "pos_date":1346336184000,
 *        "license":"Bici_Rohm",
 *        "vehicle_state":"0"
 *        }]
 *     }
 */
router.get('/tracking/:id', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    } 
    else {
      var id = req.params.id;

      log.info("GET: /tracking/"+id);

      if (id==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      } 
      else {
        TrackingModel.getTracking(id, function(error, data)
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
    }
});

module.exports = router;