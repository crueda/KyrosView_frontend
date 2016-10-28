   
var car = null;
var username = null;
var dict = {};
var deviceIdDict = {};
var iconDict = {};
var iconBase64Dict = {};
var vehicleLicenseDict = {};
var iconRealTimeDict = {};
var iconCoverDict = {};
var iconAlarmDict = {};
var dateDict = {};
var aliasDict = {};
var latitudeDict = {};
var longitudeDict = {};
var geocodingDict = {};
var speedDict = {};
var headingDict = {};
var daySpeedDict = {};
var weekSpeedDict = {};
var monthSpeedDict = {};
var dayDistanceDict = {};
var weekDistanceDict = {};
var monthDistanceDict = {};
var dayConsumeDict = {};
var weekConsumeDict = {};
var monthConsumeDict = {};
var dayHoursDict = {};
var weekHoursDict = {};
var monthHoursDict = {};
var monitorDevices = {};
var monitorVehicleLicense = [];
var greenFlagOverlay = null;
var redFlagOverlay = null;
var actualPosOverlay = null;
var tooltipSelectedVehicleLicense = "";
var selectedVehicles = new Array();
var selectedRecentVehicles = new Array();
var defaultVehicleLastLat = 0;
var defaultVehicleLastLon = 0;
var defaultVehicleLastTrackingId = 0;
var mapmode = 0;
var loadMonitorLoaded = false;
var vehicleLicenseToSelect = '';
var encontradoChecked = false;
var encontradoElementoName = false;
var encontradoVehiculo = false;

var realTimePoints = [];

function isMobile(){
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/))
    );
}
function validarEmail( email ) {
	expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if ( !expr.test(email) )
        return false;
    else
        return true;
}

function clearMap() {
    document.getElementById('attr-graph-hist').style.display = 'none';

    vehiclesRealTimeSource.clear();
    vehiclesPointSource.clear();
    vehiclesSelectedSource.clear();
    vehiclesHistSource.clear();
    vehiclesHistLineSource.clear();
    vehiclesLineSource.clear();
    mapPointSource.clear();

    if (this.greenFlagOverlay!=null)
      map.removeOverlay(this.greenFlagOverlay);
    if (this.redFlagOverlay!=null)
      map.removeOverlay(this.redFlagOverlay);

}

function clearMapHistoric() {
    document.getElementById('attr-graph-hist').style.display = 'none';

    vehiclesHistSource.clear();
    vehiclesHistLineSource.clear();

    if (this.greenFlagOverlay!=null)
      map.removeOverlay(this.greenFlagOverlay);
    if (this.redFlagOverlay!=null)
      map.removeOverlay(this.redFlagOverlay);

}

function clearMapSelected() {
    document.getElementById('attr-graph-hist').style.display = 'none';

    vehiclesSelectedSource.clear();
}

function closeTooltip() {
    
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            document.getElementById('tooltip').style.display = 'none';
        }
        document.getElementById('tooltip').style.opacity = op;
        document.getElementById('tooltip').style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.5;
    }, 50);

    document.getElementById('attr-logo').style.display = 'block';    
  }

// --------------------------------------------------------------
// showLastTrackings
// --------------------------------------------------------------
function showLastTrackings(vehicleLicense, ntrackings) {
      $.getJSON( '/api/last-trackings/vehicle/'+vehicleLicense+'?ntrackings='+ntrackings, function( data ) {
        var vtracking = [];
        var vlat = [];
        var vlon = [];
        $.each( data, function( key, val ) {
          vlat.push (val.location.coordinates[1]);
          vlon.push  (val.location.coordinates[0]);
          vtracking.push (val.tracking_id);
        }); 
        addLinesTracking(vehicleLicense, vtracking, vlat, vlon);
    });
}

function saveSelectedVehicles(username) {
    var selectedVehiclesStr = "";
    for (var i=0; i<selectedVehicles.length; i++) {
      if (i==0) {
        selectedVehiclesStr = selectedVehicles[i];
      }
      else {
        selectedVehiclesStr = selectedVehiclesStr + "," + selectedVehicles[i];
      }
    }

    // guardar en bbdd
    var urlJson = "/api/monitor/checked/" + username + "?vehicleLicenseList="+selectedVehiclesStr;
    $.getJSON( urlJson, function( data ) {
    });
}

function initSelectedVehicles() {
    // añadir el vehiculo por defecto en la capa de seleccion (para que salga en el centrado)
    addEmptyFeatureSelected(defaultVehicleLastLon, defaultVehicleLastLat);

    for (var i=0; i<selectedVehicles.length; i++) {
      addVehicleSelectedToMap(selectedVehicles[i]);
    }    
}

function showSelectedVehicles() {
    //clearMapHistoric();
    clearMap();
    mapmode=2;

    // añadir el vehiculo por defecto en la capa de seleccion (para que salga en el centrado)
    //addEmptyFeatureSelected(defaultVehicleLastLon, defaultVehicleLastLat);

    for (var i=0; i<selectedVehicles.length; i++) {
      addVehicleSelectedToMap(selectedVehicles[i]);
    }    

  }

  function showSelectedRecentVehicles() {
    //clearMapHistoric();
    clearMap();
    mapmode=2;

    for (var i=0; i<selectedRecentVehicles.length; i++) {
      addVehicleSelectedToMap(selectedRecentVehicles[i]);
    }    
  }

  function loadSelectedVehicles() {
    // añadir el vehiculo por defecto en la capa de seleccion (para que salga en el centrado)
    addEmptyFeatureSelected(defaultVehicleLastLon, defaultVehicleLastLat);

    for (var i=0; i<selectedVehicles.length; i++) {
      addVehicleSelectedToMap(selectedVehicles[i]);
    }    
  }

  function showTrackingFind(vehicleLicense) {
    clearMap();
    mapmode = 2;

    addVehicleFindToMap(vehicleLicense);
}



  function addActualPosition(lat, lon, accuracy) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: 0,
        elementId: 'actualPosition',
        //name: "<%= __('actual_position') %>"
        name: "Posición"
      });

      iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.6,
         rotation: 0,
         src: './img/points/beacon_ball_green.gif'
        }))
      })];

      iconFeature.setStyle(iconStyle);
      
      vehiclesRealTime.addFeature(iconFeature); 

      // circulo animado
      var coordinate = iconFeature.getGeometry().getCoordinates();
      var elem = document.createElement('div');
      elem.setAttribute('class', 'circleOutPos');
      this.actualPosOverlay = new ol.Overlay({
                    element: elem,
                    position: coordinate,
                    positioning: 'center-center'
      });
      map.addOverlay(actualPosOverlay);
  }

  function addTrackingHistPoint(vehicleLicense, trackingId, lat, lon) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        elementId: 'trackingPoint',
        vehicleLicense: vehicleLicense,
        //name: "<%= __('tracking_point') %>"
        name: "Tracking"
      });

      iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.6,
         rotation: 0,
         src: './img/points/beacon_ball_blue.gif'
        }))
      })];

      iconFeature.setStyle(iconStyle);
      
      vehiclesHistSource.addFeature(iconFeature); 
  }

  function addTrackingPointEvent(vehicleLicense,trackingId,eventType, eventDate, lat, lon) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        vehicleLicense: vehicleLicense,
        elementId: 'trackingPoint',
        name: getEventDescription(eventType)
      });

      iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.9,
         rotation: 0,
         src: getEventIconSmall(eventType)
        }))
      })];

      iconFeature.setStyle(iconStyle);
      
      vehiclesRealTimeSource.addFeature(iconFeature); 
  }

  function addTrackingHistPointEvent(vehicleLicense,trackingId,eventType, eventDate, lat, lon) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        vehicleLicense: vehicleLicense,
        elementId: 'trackingPoint',
        name: getEventDescription(eventType)
      });

      iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.7,
         rotation: 0,
         src: getEventIcon(eventType)
        }))
      })];

      iconFeature.setStyle(iconStyle);
      
      vehiclesHistSource.addFeature(iconFeature); 
  }


  function getEventDescription(eventType) {
    //var evento = EVENT_ENUM.getByValue('value', eventType);
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].description;      
    }
    return "";
  }

  function getEventName(eventType) {
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].name;      
    }
    return "";
  }

  function getEventIcon(eventType) {
    return './images/' + getEventName(eventType) + '_info_40.png'; 
  }

  function getEventIconSmall(eventType) {
    return './images/' + getEventName(eventType) + '_info_16.png'; 
  }

    function addTrackingHistPointStart(vehicleLicense, trackingId, lat, lon) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        elementId: 'trackingPoint',
        vehicleLicense: vehicleLicense,
        //name: "<%= __('init_tracking_point') %>"
        name: "Punto de tracking inicial>"
      });

      iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.8,
         rotation: 0,
         src: './img/points/flag_green.png'
        }))
      })];

      iconFeature.setStyle(iconStyle);
      
      vehiclesHistSource.addFeature(iconFeature); 

      // circulo animado
      var coordinate = iconFeature.getGeometry().getCoordinates();
      var elem = document.createElement('div');
      elem.setAttribute('class', 'circleOut');
      this.greenFlagOverlay = new ol.Overlay({
                    element: elem,
                    position: coordinate,
                    positioning: 'center-center'
      });
      map.addOverlay(greenFlagOverlay);
  }

    function addTrackingHistPointEnd(vehicleLicense, trackingId, lat, lon, posDate) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        elementId: 'trackingPoint',
        vehicleLicense: vehicleLicense,
        //name: "<%= __('end_tracking_point') %>"
        name: "Punto de tracking final"
      });
      iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.8,
         rotation: 0,
         anchor: [0.5, 0.5],
         offset: [10, 10],
         src: './img/points/flag_red.png'
        }))
      })];
      iconFeature.setStyle(iconStyle);
      
      vehiclesHistSource.addFeature(iconFeature); 

      var iconFeatureVehicle = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        elementId: 'trackingPoint',
        vehicleLicense: vehicleLicense,
        //name: "<%= __('end_tracking_point') %>"
        name: "Punto de tracking final"
      });
      var image_src = getVehicleIcon(vehicleLicense, 0, posDate); 
      iconStyleVehicle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.8,
         src: image_src,
       }))
      })];
      iconFeatureVehicle.setStyle(iconStyleVehicle);

      vehiclesHistSource.addFeature(iconFeatureVehicle); 


      // circulo animado
      var coordinate = iconFeature.getGeometry().getCoordinates();
      var elem = document.createElement('div');
      elem.setAttribute('class', 'circleOut');
      this.redFlagOverlay = new ol.Overlay({
                    element: elem,
                    position: coordinate,
                    positioning: 'center-center'
      });
      map.addOverlay(redFlagOverlay);      
  }


  function addTrackingHistLine(lat1, lon1, lat2, lon2) {
      var coords = [];
      coords.push([lon1, lat1]);
      coords.push([lon2, lat2]);

      var lineString = new ol.geom.LineString(coords);
      lineString.transform('EPSG:4326', 'EPSG:3857');

      // create the feature
      var featureLine = new ol.Feature({
        geometry: lineString,
        name: "Tracking"
      });
      vehiclesHistLineSource.addFeature(featureLine);
  }

  function openShare() {
    $('#myModal').modal('hide');
    $('#myModalShare').modal('show');
  }
  
  function openHist() {
    $('#myModal').modal('hide');
    $('#licenseHist').val(tooltipSelectedVehicleLicense);
    /*
    var date = new Date(dateDict[tooltipSelectedVehicleLicense]);

    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var hours = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var seconds = pad(date.getSeconds());

$('#datetimepicker2').datetimepicker('remove');
 $('#datetimepicker2').datetimepicker({
      locale: 'en',
      defaultDate: date
    });
$('#datetimepicker2').datetimepicker('update');
*/
//$('#datetimepicker2').data("DateTimePicker").defaultDate("10/23/2016 3:21 PM");
// $("#datetimepicker2").val("18:56:00");
	//$("#datetimepicker2").data('DateTimePicker').setLocalDate(new Date(year, month, day, 00, 01));

    //$("#datetimepicker2").datetimepicker("setDate", date);
	//$('#datetimepicker2').datetimepicker('update', lastPosDate);
    
    $('#myModalCalendar').modal('show');
  }
  
  function showPois(username) {
      vectorPoiSource.clear();

      var extent = map.getView().calculateExtent(map.getSize());
      extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      var fileJson = "/api/poi/box?ullon="+extent[0]+"&ullat="+extent[1]+"&drlon="+extent[2]+"&drlat="+extent[3]+"&username=" + username;

      //var fileJson = "/api/poi/box?ullon=-6.1&ullat=42.1&drlon=-5.1&drlat=41.1&username=<%=user%>"
      document.getElementById('attr-loading').style.display = 'block';
        $.getJSON( fileJson, function( data ) {
          $.each( data, function( key, val ) {
              var lat = val.location.coordinates[1];
              var lon = val.location.coordinates[0];
              var poiId = val.id;
              var poiName = val.name;
              var poiIcon = val.icon;

              addPoiPoint(poiId, poiName, poiIcon, lat, lon);
          });
          document.getElementById('attr-loading').style.display = 'none';
        });  
        
  }

  function addPoiPoint(poiId, poiName, icon, lat, lon) {
      var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

      var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: poiId,
        elementId: 'poi',
        name: poiName
      });

      var iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.8,
         rotation: 0,
         src: './images/pois/' + icon
        }))
      })];

      iconFeature.setStyle(iconStyle);
      
      vectorPoiSource.addFeature(iconFeature); 
  }


// --------------------------------------------------------------
// 
// --------------------------------------------------------------

  function showRecentPos() {
      // Llamada a la api
      $.getJSON( '/api/tracking1', function( data ) {
        var i=1;
        $.each( data, function( key, val ) {
          // comprobar si monitorizo el vehiculo
          if (monitorVehicleLicense.indexOf(val.vehicle_license) != -1 && i<20) {

            var icon = "";
            if (iconBase64Dict[val.vehicle_icense]!=null && iconBase64Dict[val.vehicle_license]!='') {
              icon = "<img src='data:image/png;base64," + iconBase64Dict[val.vehicle_license] + "'/>";      
            } else {
              icon = "<img src='./images/" + iconRealTimeDict[val.vehicle_license] + "'/>";      
            }

            //var d = new Date(val.pos_date+date.getTimezoneOffset()*60*1000);
            var date = new Date(val.pos_date);
		    var year = date.getFullYear();
		    var month = pad(date.getMonth() + 1);
		    var day = pad(date.getDate());
		    var hours = pad(date.getHours());
		    var minutes = pad(date.getMinutes());
		    var seconds = pad(date.getSeconds());

   			var datestring = day + "/" + month + "/" + year + "<br>" + hours + ":" + minutes + ":" + seconds;

            //var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();

            var check = "";
            if (i==1)
              check = "<input type='radio' id='selectRecent' name='selectRecent' value='" + val.vehicle_license + "' checked>";
            else
              check = "<input type='radio' id='selectRecent' name='selectRecent' value='" + val.vehicle_license + "'>";
            //$('#addr'+i).html("<td class='text-center'>" + check + "</td>" + "<td class='text-center'>"+ icon +"</td><td>" + val.vehicle_license + "</td><td class='text-center'>" + datestring + "</td>");
			$('#addr'+i).html("<td class='text-center'>"+ icon +"</td><td>" + val.vehicle_license + "</td><td class='text-center'>" + datestring + "</td>");
			$('#addr'+i).attr( 'id',val.vehicle_license);
            $('#tab_logic').append('<tr id="addr'+(i+1)+'" class="clickable-row"></tr>');
          }
          i++; 
        });

		$('#recentDiv').height($(window).height()-200);
        $('#myModalRecentPos').modal('show'); 
      });
  }

  function openMenuKyros() {
    $('#myModalMenuKyros').modal('show');
  }


// --------------------------------------------------------------
// Tooltip
// --------------------------------------------------------------

function updateTooltipData(vehicleLicense) {
    //var date = new Date(dateDict[vehicleLicense]+date.getTimezoneOffset()*60*1000);
    var date = new Date(dateDict[vehicleLicense]);
    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var hours = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var seconds = pad(date.getSeconds());
    document.getElementById('tooltipDate').innerHTML = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

    document.getElementById('tooltipAlias').innerHTML = aliasDict[vehicleLicense];
    document.getElementById('tooltipLatitude').innerHTML = latitudeDict[vehicleLicense].toFixed(4);
    document.getElementById('tooltipLongitude').innerHTML = longitudeDict[vehicleLicense].toFixed(4);
    document.getElementById('tooltipLocation').innerHTML = geocodingDict[vehicleLicense];
    document.getElementById('tooltipSpeed').innerHTML = speedDict[vehicleLicense].toFixed(1);
    document.getElementById('tooltipHeading').innerHTML = headingDict[vehicleLicense].toFixed(1);
    if (geocodingDict[vehicleLicense]=='' || geocodingDict[vehicleLicense]==undefined) {
      
      $.getJSON('https://nominatim.openstreetmap.org/reverse', {
      lat: latitudeDict[vehicleLicense],
      lon: longitudeDict[vehicleLicense],
      format: 'json',
      }, function (result) {
        //console.log(result);
        document.getElementById('tooltipLocation').innerHTML = result.display_name;


      }); 

    }

  }


function pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

function openTooltipTrackingPoint(vehicleLicense, trackingId) {
    
    var urlJson = "/api/tracking?vehicleLicense="+vehicleLicense+"&trackingId="+trackingId;
    //alert(urlJson);
      $.getJSON( urlJson, function( data ) {
      $.each( data, function( key, val ) {

      document.getElementById('tooltipTrackingTrackingId').innerHTML = trackingId;
      //var date = new Date(val.pos_date+date.getTimezoneOffset()*60*1000);
      var date = new Date(val.pos_date);
      var year = date.getFullYear();
      var month = pad(date.getMonth() + 1);
      var day = pad(date.getDate());
      var hours = pad(date.getHours());
      var minutes = pad(date.getMinutes());
      var seconds = pad(date.getSeconds());

      document.getElementById('tooltipTrackingDate').innerHTML = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
      document.getElementById('tooltipTrackingLatitude').innerHTML = val.location.coordinates[1].toFixed(4);
      document.getElementById('tooltipTrackingLongitude').innerHTML = val.location.coordinates[0].toFixed(4);
      if (val.speed == undefined)
        document.getElementById('tooltipTrackingSpeed').innerHTML = '';
      else
        document.getElementById('tooltipTrackingSpeed').innerHTML = val.speed.toFixed(1);
      document.getElementById('tooltipTrackingAltitude').innerHTML = val.altitude.toFixed(1);
      document.getElementById('tooltipTrackingHeading').innerHTML = val.heading.toFixed(1);

      });

      $('#tooltipTrackingHeader').css('background-color', '#66c2ff');

      $('#myModalTooltipTrackingPoint').modal('show');
    });
  }

function openTooltipMapPoint(latitude, longitude) {
    

      document.getElementById('tooltipMapLatitude').innerHTML = latitude;
      document.getElementById('tooltipMapLongitude').innerHTML = longitude;

      //$('#tooltipTrackingHeader').css('background-color', '#66c2ff');

      $('#myModalTooltipMapPoint').modal('show');
  }

function getVehicleIcon(vehicleLicense, vehicleState, posDate) 
    {
      if (iconBase64Dict[vehicleLicense]!=null && iconBase64Dict[vehicleLicense]!='')
        return "data:image/png;base64,"+iconBase64Dict[vehicleLicense];

      var now = new Date();
      if (vehicleState==0)
        if (posDate < now.getTime() - 600000) 
          iconDict[vehicleLicense] = iconCoverDict[vehicleLicense]; // posicion antigua: 10 minutos
        else
            iconDict[vehicleLicense] = iconRealTimeDict[vehicleLicense];  
      else
       iconDict[vehicleLicense] = iconAlarmDict[vehicleLicense];

      return './images/' + iconDict[vehicleLicense]
    }


    function followCar(car, new_car, lat, lon) {
      if (car == new_car) {

        var new_view = new ol.View({
          center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
          zoom: map.getView().getZoom(),
          maxZoom:22,
          minZoom:3
        });

        var pan = ol.animation.pan({
          duration: 700,
          source:  (map.getView().getCenter()),
        });
        map.beforeRender(pan);
        map.setView(new_view);
      }
    }

    function centerMap2Vehicle(vehicleLicense) {
      map.getView().setCenter(ol.proj.transform([longitudeDict[vehicleLicense], latitudeDict[vehicleLicense]], 'EPSG:4326', 'EPSG:3857'));
      map.getView().setZoom(14);
    }

    function moveMap2Vehicle(vehicleLicense) {
        var new_view = new ol.View({
          center: ol.proj.transform([longitudeDict[vehicleLicense], latitudeDict[vehicleLicense]], 'EPSG:4326', 'EPSG:3857'),
          zoom: map.getView().getZoom(),
          maxZoom:22,
          minZoom:3
        });
        
        var pan = ol.animation.pan({
          duration: 3000,
          source:  (map.getView().getCenter()),
        });

        //pan = ol.animation.pan({duration: 500, source: map.getView().getCenter()})
        //zoom = ol.animation.zoom({duration: 500, resolution: map.getView().getResolution()})
        //map.beforeRender(pan, zoom)

        map.beforeRender(pan);
        map.setView(new_view);
    }



function loadVehicleIconSync(vehicleLicense) {
  // Leer el icono de un vehiculo en modo sincrono
  $.ajax({ 
    url: "/api/icon/vehicle/"+vehicleLicense, 
    dataType: 'json', 
    async: false, 
    success: function(data){ 
        iconBase64Dict[vehicleLicense] = data;
    } 
  });
}
function loadVehicleIcon(vehicleLicense) {
  // Leer el icono de un vehiculo en modo asincrono
  $.getJSON( "/api/icon/vehicle/"+vehicleLicense, function( data ) {
    iconBase64Dict[vehicleLicense] = data; 
  });
}

function getVehicleIconSync(vehicleLicense) {
  // Leer si es necesario el icono de un vehiculo en modo sincrono
  if (iconBase64Dict[vehicleLicense]!=undefined && iconBase64Dict[vehicleLicense]!='') {
    return iconBase64Dict[vehicleLicense];
  }
  else {
    $.ajax({ 
      url: "/api/icon/vehicle/"+vehicleLicense, 
      dataType: 'json', 
      async: false, 
      success: function(data){ 
          iconBase64Dict[vehicleLicense] = data;
          return iconBase64Dict[vehicleLicense];
      } 
    });
  }
}

function loadVehiclesDataSync() {
  // Leer los datos de los vehiculos en modo sincrono
  $.ajax({ 
    url: "/api/vehicles", 
    dataType: 'json', 
    async: false, 
    success: function(data){ 
        //Proceso de los datos recibidos
      $.each( data, function( key, val ) {
        iconRealTimeDict[val.vehicle_license] = val.icon_real_time;
        iconCoverDict[val.vehicle_license] = val.icon_cover;
        iconAlarmDict[val.vehicle_license] = val.icon_alarm;
        aliasDict[val.vehicle_license] = val.alias;
        deviceIdDict[val.vehicle_license] = val.device_id;
      });
    } 
  });
}

function loadVehiclesData() {
  // Leer los datos de los vehiculos
  $.getJSON( "/api/vehicles", function( data ) {
    $.each( data, function( key, val ) {
      iconRealTimeDict[val.vehicle_license] = val.icon_real_time;
      iconCoverDict[val.vehicle_license] = val.icon_cover;
      iconAlarmDict[val.vehicle_license] = val.icon_alarm;
      aliasDict[val.vehicle_license] = val.alias;
      deviceIdDict[val.vehicle_license] = val.device_id;
      // Leer el icono de todos 
      /*$.getJSON( "/api/icon/vehicle/"+val.vehicle_license, function( data ) {
          iconBase64Dict[val.vehicle_license] = data;      
      });*/
   });
  });
}

function loadVehiclesDataWithIconSync() {
  // Leer los datos de los vehiculos en modo sincrono
  $.ajax({ 
    url: "/api/vehicles", 
    dataType: 'json', 
    async: false, 
    success: function(data){ 
        //Proceso de los datos recibidos
      $.each( data, function( key, val ) {
        iconRealTimeDict[val.vehicle_license] = val.icon_real_time;
        iconCoverDict[val.vehicle_license] = val.icon_cover;
        iconAlarmDict[val.vehicle_license] = val.icon_alarm;
        aliasDict[val.vehicle_license] = val.alias;
        deviceIdDict[val.vehicle_license] = val.device_id;

        // Leer el icono del vehiculo en base64 modo sincrono
        $.ajax({ 
          url: "/api/icon/vehicle/" + val.vehicle_license, 
          dataType: 'json', 
          async: false, 
          success: function(data){ 
              //almacenar el icono recibido
              iconBase64Dict[val.vehicle_license] = data;      
          } 
        });

      });
    } 
  });
}

function loadVehiclesDataWithIcon() {
  // Leer los datos de los vehiculos
  $.getJSON( "/api/vehicles", function( data ) {
    $.each( data, function( key, val ) {
      iconRealTimeDict[val.vehicle_license] = val.icon_real_time;
      iconCoverDict[val.vehicle_license] = val.icon_cover;
      iconAlarmDict[val.vehicle_license] = val.icon_alarm;
      aliasDict[val.vehicle_license] = val.alias;
      deviceIdDict[val.vehicle_license] = val.device_id;
      // Leer el icono de todos 
      $.getJSON( "/api/icon/vehicle/"+val.vehicle_license, function( data ) {
          iconBase64Dict[val.vehicle_license] = data;      
      });
   });
  });
}

function deleteIcon() {
  var vehicleLicense = document.getElementById('tooltipVehicleLicense').innerHTML;
  iconBase64Dict[vehicleLicense] = ''; 

  document.getElementById('iconVehicle').setAttribute( 'src', 'data:image/png;base64,'+'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkeChAkHBCAqQAAACZpVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVAgb24gYSBNYWOV5F9bAAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC');
  document.getElementById('tooltipIcon').innerHTML = "<img src='./images/" + iconRealTimeDict[vehicleLicense] + "'/>";      

  clearMap();

  $.getJSON( "/api/icon/delete/"+vehicleLicense, function( data ) {
  });
}

function selectMonitor() {
  //alert("aa");
  //$('#treeview-checkable').treeview('checkNode', 655);
  $('#treeview-checkable').treeview('checkNode', [ 655, { silent: true } ]);
}

function drawNavigationPosition() {
  // posicion actual
  navigator.geolocation.getCurrentPosition(function(location) {
    addActualPosition(location.coords.latitude,location.coords.longitude,location.coords.accuracy);
  });
}

/*function initDefaultVehicleData() {

 $.getJSON( '/api/tracking1/vehicle/<%=vehicleLicense%>', function( data ) {
   $.each( data, function( key, val ) {

     processDevice (val.tracking_id,val.vehicle_license,aliasDict[val.vehicle_license],val.location.coordinates[0],val.location.coordinates[1],val.geocoding,val.speed,val.heading,val.alarm_activated, val.pos_date, val.device_id);

     // comprobar eventos
     if (val.events.length>0) {
      for (var i=0; i<val.events.length; i++) {
        addTrackingPointEvent(val.vehicle_license,val.tracking_id,val.events[i].event_type, val.events[i].event_date,val.location.coordinates[1],val.location.coordinates[0]);
      }
     }
     
     centerMap(val.location.coordinates[0],val.location.coordinates[1]);

     document.getElementById('attr-loading').style.display = 'none';

    });
 });
}*/



function reloadSelectedVehiclesData() {

    vehiclesSelectedSource.clear();
    // añadir el vehiculo por defecto en la capa de seleccion (para que salga en el centrado)
    addEmptyFeatureSelected(defaultVehicleLastLon, defaultVehicleLastLat);

    for (var i=0; i<selectedVehicles.length; i++) {
      addVehicleSelectedToMap(selectedVehicles[i]);
    }    
}

function processDevice(trackingId, vehicleLicense,alias,lon,lat,geocoding,speed,heading,vehicleState,  posDate, deviceId) {             
  if (vehicleState==undefined)
    vehicleState = 0;

  latitudeDict[vehicleLicense] = lat;
  longitudeDict[vehicleLicense] = lon;
  if (geocoding!=null && geocoding!=undefined)
    geocodingDict[vehicleLicense] = geocoding;
  else
    geocodingDict[vehicleLicense] = "";

  speedDict[vehicleLicense] = speed;
  headingDict[vehicleLicense] = heading;

  if ( (dateDict[vehicleLicense]==null) || (dateDict[vehicleLicense]<posDate) )
  {  
    // Eliminar el icono 
    /*var features = vehiclesRealTimeSource.getFeatures();
    iFeature = vehiclesRealTimeSource.getFeatureById(vehicleLicense);
    if (iFeature!=null) {
     vehiclesRealTimeSource.removeFeature(iFeature);
    }*/
    //temporal pq no funciona lo anterior
    //vehiclesRealTimeSource.clear();

    // añadir la linea
    addLineTracking(vehicleLicense, defaultVehicleLastTrackingId, defaultVehicleLastLat,defaultVehicleLastLon, trackingId, lat, lon);

    // añadir el icono
    add (vehicleLicense,alias,lon,lat,speed,heading,vehicleState, deviceId, posDate);

    defaultVehicleLastLat = lat;
    defaultVehicleLastLon = lon;
    defaultVehicleLastTrackingId = trackingId;

    updateTooltipData(vehicleLicense);   

  }
  dateDict[vehicleLicense] = posDate;
}

function add(vehicleLicense, alias, lon, lat, speed, heading, vehicleState, deviceId, posDate) {
  var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

  var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: vehicleLicense,
        elementId: 'device',
        name: alias
  });

  var image_src = getVehicleIcon(vehicleLicense, vehicleState, posDate); 
  iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.8,
         //rotation: heading,
         src: image_src,
         // size: [50, 50]
       }))
      })];
  iconFeature.setStyle(iconStyle);

  vehiclesRealTimeSource.clear();
  vehiclesRealTimeSource.addFeature(iconFeature); 

  //kyrosDevicesGroup.getLayers().push(deviceVectorLayer);
}

function addVehicleToMap(vehicleLicense) {
  $.getJSON( '/api/tracking1/vehicle/'+vehicleLicense, function( data ) {
    $.each( data, function( key, val ) {
        processDevice (val.tracking_id,val.vehicle_license,aliasDict[val.vehicle_license],val.location.coordinates[0],val.location.coordinates[1],val.geocoding,val.speed,val.heading,val.alarm_activated, val.pos_date, val.device_id);
      });                           
  });
}


function addVehicleFindToMap(vehicleLicense) {
  //if (vehicleLicense!='<%=vehicleLicense%>') {
    $.getJSON( '/api/tracking1/vehicle/'+vehicleLicense, function( data ) {
      $.each( data, function( key, val ) {
          processDeviceSelected (val.vehicle_license,aliasDict[val.vehicle_license],val.location.coordinates[0],val.location.coordinates[1],val.geocoding,val.speed,val.heading,val.alarm_activated, val.pos_date, val.device_id);

          // circulo animado?
          /*
          var coordinate = new ol.geom.Point(ol.proj.transform([val.location.coordinates[0], val.location.coordinates[1]], 'EPSG:4326', 'EPSG:3857'));
          var elem = document.createElement('div');
          elem.setAttribute('class', 'circleOutPos');
          this.actualPosOverlay = new ol.Overlay({
                    element: elem,
                    position: coordinate,
                    positioning: 'center-center'
          });
          map.addOverlay(actualPosOverlay);*/
                               
    });    
    });    
  //}
}

function processDeviceSelected(vehicleLicense,alias,lon,lat,geocoding,speed,heading,vehicleState, posDate, deviceId) {    
  if (vehicleState==undefined)
    vehicleState = 0;

  deviceIdDict[vehicleLicense]=deviceId;
  vehicleLicenseDict[vehicleLicense] = vehicleLicense;
  dateDict[vehicleLicense] = posDate;
  aliasDict[vehicleLicense] = alias;
  latitudeDict[vehicleLicense] = lat;
  longitudeDict[vehicleLicense] = lon;
  if (geocoding!=null && geocoding!=undefined)
    geocodingDict[vehicleLicense] = geocoding;
  else
    geocodingDict[vehicleLicense] = "";
  speedDict[vehicleLicense] = speed;
  headingDict[vehicleLicense] = heading;

   // añadir el icono
  addSelected (vehicleLicense,alias,lon,lat,speed,heading,vehicleState,deviceId,posDate);
}

function addSelected(vehicleLicense, alias, lon, lat, speed, heading, vehicleState, deviceId, posDate) {
    var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

    var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: vehicleLicense,
        elementId: 'device',
        name: alias
    });

    var image_src = getVehicleIcon(vehicleLicense, vehicleState, posDate); 
      
    iconStyle = [new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         scale: 0.8,
         //rotation: heading,
         src: image_src
       }))
    })];
    iconFeature.setStyle(iconStyle);

    vehiclesSelectedSource.addFeature(iconFeature); 

    // centrar el mapa en la capa de vehiculos seleccionados
    //if (mapmode==2) {
      map.getView().fit(vehiclesSelectedSource.getExtent(), map.getSize());
      if(map.getView().getZoom()>16){
          map.getView().setZoom(16);
      }      
    //}
  }

function addEmptyFeatureSelected(lon, lat) {
    var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));

    var iconFeature = new ol.Feature({
        geometry: geo_point,
        id: 0,
        elementId: '',
        name: ''
    });

    var normalStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 0,
        fill: new ol.style.Fill({
          color: 'rgba(20,150,200,0.3)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(20,130,150,0.8)',
          width: 0
        })
      })
    });
    iconFeature.setStyle(normalStyle);

    vehiclesSelectedSource.addFeature(iconFeature); 

    // centrar el mapa en la capa de vehiculos seleccionados
    map.getView().fit(vehiclesSelectedSource.getExtent(), map.getSize());
    if(map.getView().getZoom()>20){
        map.getView().setZoom(20);
    }
  }


    function addLineTracking(vehicleLicense, trackingId1, lat1, lon1, trackingId2, lat2, lon2)
    {
      var coords = [];
      if (lat1!=0) {
        coords.push([lon1, lat1]);

        /*var iconFeature1 = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([lon1, lat1], 'EPSG:4326', 'EPSG:3857')),
          id: trackingId1,
          elementId: 'trackingPoint',
          vehicleLicense: vehicleLicense,
          name: "<%= __('tracking_point') %>"

        });
        iconFeature1.setStyle(new ol.style.Style({
          //image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ //({
          /* scale: 0.8,
           src: './img/points/beacon_ball_blue.gif'
         }))
        }));
        vehiclesLineSource.addFeature(iconFeature1); 
        */

        //addTrackingPointEffect(vehicleLicense, trackingId1, lat1, lon1);

     }
     if (lat2!=0) {
      coords.push([lon2, lat2]);

      var lineString = new ol.geom.LineString(coords);
      // transform to EPSG:3857
      lineString.transform('EPSG:4326', 'EPSG:3857');

      var lineStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
          //color: '#'+Math.floor(Math.random()*16777215).toString(16),
          //color: '#0000ff',
          color: '#66c2ff',        
          width: 3
        })
      });

  }

/*
 if (realTimePoints.length>2) {
    //console.log(realTimePoints.shift());
    vehiclesPointSource.removeFeatureById(realTimePoints.shift());
  }*/

  // create the feature
  var featureLine = new ol.Feature({
    geometry: lineString,
    style: lineStyle,
    //name: "<%= __('tracking_line') %>"
    name: "Tracking"
  });
  vehiclesLineSource.addFeature(featureLine);

  addTrackingPointEffect(vehicleLicense, trackingId1, lat1, lon1);

  // Borrar las ultimas
  /*var features = vehiclesLineSource.getFeatures();
  if (features.length > 10) {
    vehiclesLineSource.removeFeature(features[0]);
  }*/

  //realTimePoints.push(trackingId1);

  //console.log(realTimePoints);

  /*var features = vehiclesPointSource.getFeatures();
  if (features.length > 10) {
    vehiclesPointSource.removeFeature(features[0]);
  }*/
 
  }

   function addLinesTracking(vehicleLicense, vtracking, vlat, vlon) {

    //clearMapRealTime();
    
    // pintar los puntos
    var coords = [];
    for (var i=0; i<vtracking.length; i++) {
      if (vlat[i]!=0) {
        coords.push([vlon[i], vlat[i]]);

        var iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([vlon[i], vlat[i]], 'EPSG:4326', 'EPSG:3857')),
          id: vtracking[i],
          elementId: 'trackingPoint',
          vehicleLicense: vehicleLicense,
          //name: "<%= __('tracking_point') %>"
          name: "Tracking"
        });
        iconFeature.setStyle(new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
           scale: 0.8,
           src: './img/points/beacon_ball_blue.gif'
         }))
        }));
        vehiclesLineSource.addFeature(iconFeature); 
      }
    }
    
    // Crear la linea
    var lineString = new ol.geom.LineString(coords);
    // transform to EPSG:3857
    lineString.transform('EPSG:4326', 'EPSG:3857');

    var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        //color: '#'+Math.floor(Math.random()*16777215).toString(16),
        //color: '#0000ff',
        color: '#66c2ff',        
        width: 4
      })
    });
    var featureLine = new ol.Feature({
      geometry: lineString,
      style: lineStyle,
      //name: "<%= __('tracking_line') %>"
      name: "Tracking"
    });
    vehiclesLineSource.addFeature(featureLine);

    // centrar el mapa
    map.getView().fit(vehiclesLineSource.getExtent(), map.getSize());
    if(map.getView().getZoom()>20){
      map.getView().setZoom(20);
    }
  }

 function centerMap(lon, lat) {
  /*map.setView (new ol.View({
      center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
      zoom: 14,
      maxZoom:22,
      minZoom:3
    }));*/
   // otra forma de centrar
    /*map.getView().fit(vehiclesRealTimeSource.getExtent(), map.getSize());
    if(map.getView().getZoom()>20){
      map.getView().setZoom(20);
    }*/
    //y otra forma mas (esta sin crear un view)
    map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(14);
    // y otra con efecto
    /*
    var new_view = new ol.View({
          center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
          zoom: map.getView().getZoom(),
          maxZoom:22,
          minZoom:3
        });

        var pan = ol.animation.pan({
          duration: 700,
          source:  (map.getView().getCenter()),
        });
        map.beforeRender(pan);
        map.setView(new_view);
    */
 }

 function moveMap(lon, lat) {
    map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));   
 }

 function getInitDateLastDays(days) {
        var milliseconds = (new Date).getTime();
        return (milliseconds - days * 86400000);
  }
  
  function addTrackingHistPointEffect(vehicleLicense, trackingId, lat, lon) { 
  var f, r = map.getView().getResolution() *10;
       
  var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
  var f = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        vehicleLicense: vehicleLicense,
        elementId: 'trackingPoint',
        lon: lon,
        lat: lat,
        //name: "<%= __('position_map') %>"  
        name: "Posición"
  });

  vehiclesHistSource.addFeature(f);

  vehiclesHistLayer.animateFeature (f, 
      [ new ol.featureAnimation["Drop"](
        { speed: Number(1.4), 
          duration: Number(260),
          side: false
        }),
        new ol.featureAnimation[
        "Bounce"](
        { speed: Number(0.8), 
          duration: Number(760),
          horizontal: /Slide/.test("Shake")
        })
      ]);
  }

  function addTrackingPointEffect(vehicleLicense, trackingId, lat, lon) { 
    if (lat!=0) {

    var f, r = map.getView().getResolution() *10;
         
    var geo_point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    var f = new ol.Feature({
          geometry: geo_point,
          id: trackingId,
          vehicleLicense: vehicleLicense,
          elementId: 'trackingPoint',
          lon: lon,
          lat: lat,
          //name: "<%= __('position_map') %>"  
          name: "Posición"
    });

    vehiclesPointSource.addFeature(f);

    vehiclesPointLayer.animateFeature (f, 
        [ new ol.featureAnimation["Drop"](
          { speed: Number(1.4), 
            duration: Number(260),
            side: false
          }),
          new ol.featureAnimation[
          "Bounce"](
          { speed: Number(0.8), 
            duration: Number(760),
            horizontal: /Slide/.test("Shake")
            //horizontal: /Slide/.test("Drop")
          })
        ]);
    }
  }

  // Add a feature on the map
  function addFeatureAt(trackingId, p) { 
    var f, r = map.getView().getResolution() *10;
 
        
      var geo_point = new ol.geom.Point(ol.proj.transform([p[0], p[1]], 'EPSG:4326', 'EPSG:3857'));
      var f = new ol.Feature({
        geometry: geo_point,
        id: trackingId,
        elementId: 'trackingPoint',
        //vehicleLicense: vehicleLicense,
        //name: "<%= __('tracking_point') %>"    
        name: "Tracking"  
      });

 
    vehiclesHistSource.addFeature(f);
    vehiclesHistLayer.animateFeature (f, 
      [ new ol.featureAnimation["Drop"](
        { speed: Number(0.8), 
          duration: Number(760),
          side: false
        }),
        new ol.featureAnimation[
        "Bounce"](
        { speed: Number(0.8), 
          duration: Number(760),
          horizontal: /Slide/.test("Drop")
        })
      ]);
  }

function addFeaturePointAt(p) { 
  mapPointSource.clear();

  var f, r = map.getView().getResolution() *10;
       
  var geo_point = new ol.geom.Point(ol.proj.transform([p[0], p[1]], 'EPSG:4326', 'EPSG:3857'));
  var f = new ol.Feature({
        geometry: geo_point,
        id: 0,
        elementId: 'positionPoint',
        lon: p[0],
        lat: p[1],
        //name: "<%= __('position_map') %>"  
        name: "Posición"
  });


  mapPointSource.addFeature(f);

  mapPointLayer.animateFeature (f, 
      [ new ol.featureAnimation["Drop"](
        { speed: Number(1.4), 
          duration: Number(260),
          side: false
        }),
        new ol.featureAnimation[
        "Bounce"](
        { speed: Number(0.8), 
          duration: Number(760),
          horizontal: /Slide/.test("Shake")
        })
      ]);
  }
 
