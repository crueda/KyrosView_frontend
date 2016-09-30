var http = require('http');
var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
//var MongoStore = require('connect-mongo')(session);
var MySQLStore = require('express-mysql-session')(session);

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./kyrosview.properties');

var api_tracking = require('./app/server/routes/tracking');
var api_odometer = require('./app/server/routes/odometer');
var api_activity = require('./app/server/routes/activity');
var api_poi = require('./app/server/routes/poi');
var api_monitor = require('./app/server/routes/monitor');
var api_numpositions = require('./app/server/routes/numpositions');
var api_image = require('./app/server/routes/image');

var i18n = require("i18n");

//necesario para utilizar los verbos put y delete en formularios
var methodOverride = require('method-override');

var app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.locals.pretty = true;
app.set('port', 3100);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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


// build mysql database connection url //
var dbMysqlName = properties.get('bbdd.mysql.name');
var dbMysqlHost = properties.get('bbdd.mysql.ip');
var dbMysqlPort = properties.get('bbdd.mysql.port');
var dbMysqlUser = properties.get('bbdd.mysql.user');
var dbMysqlPass = properties.get('bbdd.mysql.passwd');

var options = {
    host: dbMysqlHost,
    user: dbMysqlUser,
    password: dbMysqlPass,
    database: dbMysqlName,
};
 
var sessionStore = new MySQLStore(options);

app.use(session({
	key: 'session_kyrosview_cookie',
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
    proxy: true,
	store: sessionStore,
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds. 
	expiration: 86400000,// The maximum age of a valid session; milliseconds. 
	resave: true,
	saveUninitialized: true
}));


/*
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'node-login';

var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
if (app.get('env') == 'live'){
// prepend url with authentication credentials // 
	dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
}

app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ url: dbURL })
	})
);*/


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

app.use('/api', api_tracking);
app.use('/api', api_odometer);
app.use('/api', api_activity);
app.use('/api', api_poi);
app.use('/api', api_monitor);
app.use('/api', api_numpositions);
app.use('/api', api_image);
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
