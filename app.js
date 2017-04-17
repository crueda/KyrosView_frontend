var http = require('http');
var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoDBStore = require('connect-mongodb-session')(session);

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var api_tracking = require('./app/server/routes/tracking');
var api_odometer = require('./app/server/routes/odometer');
var api_activity = require('./app/server/routes/activity');
var api_poi = require('./app/server/routes/poi');
var api_monitor = require('./app/server/routes/monitor');
var api_numpositions = require('./app/server/routes/numpositions');
var api_image = require('./app/server/routes/image');
var api_heatmap = require('./app/server/routes/heatmap');
var api_vehicle = require('./app/server/routes/vehicle');
var api_share = require('./app/server/routes/share');
var api_watch = require('./app/server/routes/watch');
var api_mailmap = require('./app/server/routes/mailmap');
var api_login = require('./app/server/routes/login');
var api_push = require('./app/server/routes/push');
var api_icon = require('./app/server/routes/icon');


var i18n = require("i18n");

//necesario para utilizar los verbos put y delete en formularios
var methodOverride = require('method-override');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');

app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

//configuramos methodOverride
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Access,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});


var dbMongoName = properties.get('bbdd.mongo.name');
var dbMongoHost = properties.get('bbdd.mongo.ip');
var dbMongoPort = properties.get('bbdd.mongo.port');

 var store = new MongoDBStore(
      {
        uri: 'mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName + '?connectTimeoutMS=500&maxPoolSize=100',
        collection: 'USER_SESSIONS'
      });

    // Catch errors
    store.on('error', function(error) {
      //assert.ifError(error);
      //assert.ok(false);
    });

    app.use(require('express-session')({
      secret: 'faeb4453e5d14fef6d04637f780787c76c73d1b4',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      },
      store: store,
      resave: true,
      saveUninitialized: true
    }));


i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales',
    queryParameter: 'lang',
    autoReload: true,
    cookie: 'kyrosview_lang',
    defaultLocale: 'es'
});
app.use(i18n.init);

//var greeting = i18n.__('Hello')
//console.log("-->"+ greeting);
//var greeting = res.__('Hello');


app.use('/api', api_login);

app.use('/api', api_push);

app.use('/api', api_tracking);
app.use('/api', api_odometer);
app.use('/api', api_activity);
app.use('/api', api_poi);
app.use('/api', api_monitor);
app.use('/api', api_numpositions);
app.use('/api', api_image);
app.use('/api', api_heatmap);
app.use('/api', api_vehicle);
app.use('/api', api_share);
app.use('/api', api_watch);
app.use('/api', api_icon);
app.use('/api', api_mailmap);

// AUTENTICACION TOKEN
//app.all('/*', [require('./app/server/middlewares/validateRequest')]);
//app.all('/api/app/*', [require('./app/server/middlewares/validateRequest')]);


require('./app/server/routes/routes')(app);



// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({"message":"Not Found"})
  //next(err);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('KyrosView server listening on port ' + app.get('port'));
});

module.exports = app;
