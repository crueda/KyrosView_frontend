var express = require('express');
var router = express.Router();

var status = require("../utils/statusCodes.js");
var messages = require("../utils/statusMessages.js");

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var NotificationModel = require('../models/notification');

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

router.get('/app/notifications', function(req, res)
{
    var username = req.query.username;

      log.info("GET: /notification?username="+username);

      if (username==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.getAllNotifications(username, function(error, data)
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
            else
            {
              res.status(202).json({"response": {"status":status.STATUS_NOT_FOUND_REGISTER,"description":messages.MISSING_REGISTER}})
            }
          }
        });
      }
});

router.get('/app/notification/:_id', function(req, res)
{
    var _id = req.params._id;

      log.info("GET: /notification/"+_id);

      if (_id==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.getNotification(_id, function(error, data)
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
            else
            {
              res.status(202).json({"response": {"status":status.STATUS_NOT_FOUND_REGISTER,"description":messages.MISSING_REGISTER}})
            }
          }
        });
      }
});

router.get('/app/notificationLimit', function(req, res)
{
    var username = req.query.username;
    var max = req.query.max;
    if (max==undefined) {
      max = 100;
    }
      log.info("GET: /notificationLimit?username="+username+"&max="+max);

      if (username==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.getLastNotifications(username, max, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined')
            {
              res.status(200).json(data)
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


router.get('/app/notification/archive', function(req, res)
{
      var username = req.query.username;
      var notificationId = req.query.notificationId;

      log.info("GET: /notification/archive?username="+username + "&notificationId="+notificationId);

      if (username==null || notificationId==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.archiveNotification(username, notificationId, function(error, data)
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

router.get('/app/notification/archive/user/:username', function(req, res)
{
      var username = req.params.username;

      log.info("GET: /notification/archive/user/"+username);

      if (username==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.archiveAllNotifications(username, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined')
            {
              res.status(200).json("ok")
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

router.get('/app/notification/config/user/:username', function(req, res)
{
  var username = req.params.username;
  var vehicleLicense = req.query.vehicleLicense;

  log.info("GET: /notification/config/user/"+username);

  if (username==null || vehicleLicense==null) {
    res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
  }
  else {
    NotificationModel.getConfigNotifications(username, vehicleLicense, function(error, data) {
      if (data == null) {
          res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
      } else {
        if (typeof data !== 'undefined' && data.length > 0) {
          res.status(200).json(data)
        } else if (typeof data == 'undefined' || data.length == 0) {
          res.status(200).json([])
        } else {
          res.status(202).json({"response": {"status":status.STATUS_NOT_FOUND_REGISTER,"description":messages.MISSING_REGISTER}})
        }
      }
    });
  }
});

router.get('/app/notification/setToken', function(req, res)
{
      var username = req.query.username;
      var token = req.query.token;

      log.info("GET: /notification/setToken?username="+username + "&token="+token);

      if (username==null || token==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.saveToken(username, token, function(error, data)
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

router.get('/app/notification/config/add', function(req, res)
{
      var username = req.query.username;
      var vehicleLicense = req.query.vehicleLicense;
      var eventIdList = req.query.eventIdList;

      log.info("GET: /notification/config/add?username="+username + "&vehicleLicense=" + vehicleLicense + "&eventIdList="+eventIdList);

      if (username==null || vehicleLicense==null || eventIdList==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.configNotificationAdd(username, vehicleLicense, eventIdList, function(error, data)
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

router.get('/app/notification/config/remove', function(req, res)
{
      var username = req.query.username;
      var vehicleLicense = req.query.vehicleLicense;
      var eventIdList = req.query.eventIdList;

      log.info("GET: /notification/config/remove?username="+username + "&vehicleLicense=" + vehicleLicense + "&eventIdList="+eventIdList);

      if (username==null || vehicleLicense==null || eventIdList==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.configNotificationRemove(username, vehicleLicense, eventIdList, function(error, data)
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

router.get('/app/notification/config/change', function(req, res)
{
      var username = req.query.username;
      var vehicleLicense = req.query.vehicleLicense;
      var eventType = req.query.eventType;
      var enabled = req.query.enabled;

      log.info("GET: /notification/config/change?username="+username + "&vehicleLicense=" + vehicleLicense + "&eventType="+eventType + "&enabled=" + enabled);

      if (username==null || vehicleLicense==null || eventType==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.configNotificationChange(username, vehicleLicense, eventType, enabled, function(error, data)
        {
            //si existe enviamos el json
            if (typeof data !== 'undefined')
            {
              res.status(200).json(data)
            }
            else
            {
              res.status(202).json({"response": {"status":status.STATUS_NOT_FOUND_REGISTER,"description":messages.MISSING_REGISTER}})
            }
        });
      }
});

router.get('/app/notification/enable/user/:username', function(req, res)
{
      var username = req.params.username;

      log.info("GET: /notification/enable/user/"+username);

      if (username==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.enableUserNotifications(username, function(error, data)
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

router.get('/app/notification/disable/user/:username', function(req, res)
{
      var username = req.params.username;

      log.info("GET: /notification/disable/user/"+username);

      if (username==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.disableUserNotifications(username, function(error, data)
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

router.get('/app/notification/status/user/:username', function(req, res)
{
      var username = req.params.username;

      log.info("GET: /notification/status/user/"+username);

      if (username==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.statusUserNotifications(username, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined')
            {
              res.status(200).json(data)
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

router.get('/app/notification/status', function(req, res)
{
    var username = req.query.username;
    var vehicleLicense = req.query.vehicleLicense;

      log.info("GET: /notification/status/?username="+username+"&vehicleLicense="+vehicleLicense);

      if (username==null || vehicleLicense==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        NotificationModel.statusUserVehicleNotifications(username, vehicleLicense, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined')
            {
              res.status(200).json(data)
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
