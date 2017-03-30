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


router.get('/tracking1/vehicle/:vehicleLicense', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var vehicleLicense = req.params.vehicleLicense;
      log.info("GET: /tracking1/vehicle/"+vehicleLicense);

      TrackingModel.getTracking1FromVehicle(vehicleLicense,function(error, data)
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

router.get('/tracking1/device/:deviceId', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var deviceId = req.params.deviceId;
      log.info("GET: /tracking1/device/"+deviceId);

      TrackingModel.getTracking1FromDevice(deviceId,function(error, data)
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


router.get('/tracking1', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
        TrackingModel.getTracking1(function(error, data)
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


router.get('/tracking1/vehicles', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var vehicleLicenseList = req.query.vehicleLicenseList;
      log.info("GET: /tracking1/vehicles?vehicleLicenseList="+vehicleLicenseList);
      if (vehicleLicenseList==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        TrackingModel.getTracking1FromVehicles(vehicleLicenseList,function(error, data)
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

router.get('/tracking1radio', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var latitude = req.query.latitude;
      var longitude = req.query.longitude;
      var radio = req.query.radio;
      log.info("GET: /tracking1radio?latitude="+latitude+"&longitude="+longitude+"&radio="+radio);
      if (latitude==null || longitude==null || radio==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        TrackingModel.getTracking1Radio(latitude, longitude, radio,function(error, data)
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


router.get('/last-trackings/vehicle/:vehicleLicense', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var vehicleLicense = req.params.vehicleLicense;

      var ntrackings = req.query.ntrackings;

      if (ntrackings==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        log.info("GET: /last-trackings/vehicle/?ntrackings="+ntrackings);

        var requestData = {
          vehicleLicense : vehicleLicense,
          ntrackings : ntrackings
        };
        TrackingModel.getLastTrackingsFromVehicle(requestData,function(error, data)
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

router.get('/tracking/vehicle/:vehicleLicense', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var vehicleLicense = req.params.vehicleLicense;
      var initDate = req.query.initDate;
      var endDate = req.query.endDate;

      log.info("GET: /tracking/vehicle/"+vehicleLicense);

      if (initDate==null || endDate==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        var requestData = {
          vehicleLicense : vehicleLicense,
          initDate : initDate,
          endDate : endDate
        };
        TrackingModel.getTrackingFromVehicleAndDate(requestData, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined' && data.length > 6999)
            {
              res.status(200).json({"status": "nok", "result": data});
            }
            else if (typeof data !== 'undefined' && data.length > 0)
            {
              res.status(200).json({"status": "ok", "result": data});
            }
            else if (typeof data == 'undefined' || data.length == 0)
            {
              res.status(200).json({"status": "ok", "result": []});
              //res.status(200).json([])
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
        TrackingModel.getTrackingFromDeviceAndDate(requestData, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
            //si existe enviamos el json
            if (typeof data !== 'undefined' && data.length > 6999)
            {
              res.status(200).json({"status": "nok", "result": data});
            }
            else if (typeof data !== 'undefined' && data.length > 0)
            {
              res.status(200).json({"status": "ok", "result": data});
            }
            else if (typeof data == 'undefined' || data.length == 0)
            {
              res.status(200).json({"status": "ok", "result": []});
              //res.status(200).json([])
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

router.get('/tracking', function(req, res)
{
    if (req.session.user == null){
      res.redirect('/');
    }
    else {
      var trackingId = req.query.trackingId;

      if (trackingId==null) {
        res.status(202).json({"response": {"status":status.STATUS_VALIDATION_ERROR,"description":messages.MISSING_PARAMETER}})
      }
      else {
        log.info("GET: /tracking?trackingId="+trackingId);
        var requestData = {
          vehicleLicense : vehicleLicense,
          trackingId : trackingId
        };
        TrackingModel.getTrackingFromId(requestData, function(error, data)
        {
          if (data == null)
          {
            res.status(202).json({"response": {"status":status.STATUS_FAILURE,"description":messages.DB_ERROR}})
          }
          else
          {
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
    }
});

module.exports = router;
