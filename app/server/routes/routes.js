
var CT = require('../modules/country-list');
var AM = require('../modules/account-manager');
var EM = require('../modules/email-dispatcher');

var colors = require('colors');

module.exports = function(app) {

    // set the view engine to ejs
    //app.set('view engine', 'ejs');
    
    //app.engine('jade', require('jade').__express);
    //app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.set('view engine', 'jade');
    
    // main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login.ejs', { msg: '', 	msg_color: 'black'});
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					//console.log("FIJAS COOKIE -1 ");
				    //res.cookie('kyrosview_lang', 'en', { maxAge: 900000, httpOnly: true });
					//res.redirect('/home');
					res.redirect('/map');
				}	else{
					res.render('login.ejs', { msg: '', msg_color: 'black'});
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.render('login.ejs', {
                	msg: res.__('login_incorrect'),
                	msg_color: 'red'
				});
			}	else{
				req.session.user = o;
				//console.log("FIJAR COOKIE a: " + o.lang);
				res.cookie('kyrosview_lang', o.lang, { maxAge: 900000, httpOnly: true });
				/*if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}*/
				res.redirect('/map');
			}
		});
	});
	
// logged-in user homepage //
	
	 app.get('/globe', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	
		else{
        	res.render('globe.ejs', {
            	user : req.session.user.username,
            	deviceId : req.session.user.deviceId
			});            
		}
	});
	
    app.get('/map', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            //res.sendFile(__dirname+'/web/map.html');
            res.render('map.ejs', {
            	msg : '',
                user : req.session.user.username,
                deviceId : req.session.user.deviceId
			});
            
		}
	});

    app.get('/gmap', function(req, res) {
		if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            res.render('gmap.ejs', {
            	msg : '',
                user : req.session.user.username,
                deviceId : req.session.user.deviceId
			});            
		}
	});

    /*
    app.post('/map', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            //res.sendFile(__dirname+'/web/map.html');
            //res.render('map');
            res.render('map.ejs', {
            	msg : '',
                user : req.session.user.username,
                deviceId : req.session.user.deviceId
			});
		}
	});*/

    app.get('/graphs', function(req, res) {
		if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            res.render('graphs.ejs', {
                user : req.session.user.username,
                deviceId : req.session.user.deviceId
			});
            
		}
	});

    /*
	app.post('/graphs', function(req, res) {
		if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            res.render('map.ejs', {
            	msg : '',
                user : req.session.user.username,
                deviceId : req.session.user.deviceId
			});
		}
	});
	*/
	/*
    app.get('/device', function(req, res) {
		if (req.session.user == null || req.session.user.deviceId == null){
		// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            res.render('device.ejs', {
                user : req.session.user.username,
                deviceId : req.session.user.deviceId,
                icon : req.session.user.icon,
                alias : req.session.user.alias,
                vehicleLicense : req.session.user.vehicleLicense,
                latitude : req.session.user.latitude,
                longitude : req.session.user.longitude,
                speed : req.session.user.speed
			});
            
		}
	});*/

	/*app.get('/device', function(req, res) {
		if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            res.render('device.ejs', {
                user : req.session.user.username,
                deviceId : req.body['deviceId']
			});
		}
	});
	*/
    
	app.post('/map', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateUserDevice({
				username : req.session.user.username,
				deviceId : req.body['deviceId']
			}, function(e, o){
				if (e!='ok'){
					res.status(400).send('error-updating-device');
				}	else{
					req.session.user.deviceId = req.body['deviceId']; 
					/*req.session.user.icon = req.body['icon']; 
					req.session.user.alias = req.body['alias']; 
					req.session.user.vehicleLicense = req.body['vehicleLicense']; 
					req.session.user.latitude = req.body['latitude']; 
					req.session.user.longitude = req.body['longitude']; 
					req.session.user.speed = req.body['speed']; */
					res.render('map.ejs', {
						msg: res.__('device_selected'),
                		user : req.session.user.username,
                		deviceId : req.body['deviceId']
					});					
				}
			});
		}
	});

	app.get('/home', function(req, res) {
		//console.log ("-->" + req.session.user.username);
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			//res.redirect('/');
			res.render('login.ejs', { msg: '', msg_color: 'black'});
		}	else{
			res.render('home.ejs', {
				msg: '',
				msg_color: 'black',
				udata : req.session.user,
				user: req.session.user.username,
				pass: req.session.user.password,
				firstname: req.session.user.firstname,
				lastname: req.session.user.lastname,
				email: req.session.user.email
			});
		}
	});
    
	app.post('/home', function(req, res){
		if (req.session.user == null){
			//res.redirect('/');
			res.render('login.ejs', { msg: '', msg_color: 'black'});
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				user	: req.session.user.username,
				email	: req.body['email'],
				passOld	: req.session.user.password,
				pass	: req.body['pass'],
				firstname	: req.body['firstname'],
				lastname	: req.body['lastname']
			}, function(e, o){
				if (e){
					//res.status(400).send('error-updating-account');
					res.render('home.ejs', { 
						msg: res.__('update_error'),
						msg_color: 'red',
						user	: req.session.user.username,
						email	: req.body['email'],
						pass	: req.body['pass'],
						firstname	: req.body['firstname'],
						lastname	: req.body['lastname']
					});
				}	else{
					req.session.user.password = req.body['pass'];
					req.session.user.firstname = req.body['firstname'];
					req.session.user.lastname = req.body['lastname'];
					req.session.user.email = req.body['email'];
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', req.body['user'], { maxAge: 900000 });
						res.cookie('pass', req.body['pass'], { maxAge: 900000 });	
					}
					res.render('home.ejs', { 
						msg: 'Usuario actualizado', 
						msg_color: 'green',
						user	: req.session.user.username,
						email	: req.body['email'],
						pass	: req.body['pass'],
						firstname	: req.body['firstname'],
						lastname	: req.body['lastname']
					});
				}
			});
		}
	});

	app.get('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ 
			res.redirect('/');
		});
	});

	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ 
			res.redirect('/');
		});
	})
	
// creating new accounts //
/*	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});
*/
// password reset //

	app.get('/lost-password', function(req, res) {
			res.render('passwd.ejs', { msg: '', msg_color: 'black', msg2: ''});
	});

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByUsername(req.body['user'], function(o){
			if (o){
				AM.generateUserUUID(o, function(o2) {
					if (o2) {
						EM.dispatchResetPasswordLink(o2, function(e, m){
						// this callback takes a moment to return //
						// TODO add an ajax loader to give user feedback //
							if (m!=null){
								var email = m.email.substring(0,1);
								email = email + "*******" + m.email.substring(m.email.indexOf('@'), m.email.length)
								res.render('passwd.ejs', { msg: '', msg_color: 'black', msg2: res.__('email_sent') + email});
							}	else{
								res.render('passwd.ejs', { msg: res.__('send_email_error') , msg_color: 'red', msg2: ''});
							}
						});
					}
					else {
						res.render('passwd.ejs', { msg: res.__('operation_error'), msg_color: 'red', msg2: ''});						
					}
				});

			}	else{
				res.render('passwd.ejs', { msg: res.__('user_not_found'), msg_color: 'red', msg2: ''});
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var user = req.query["u"];
		var uuid = req.query["h"];


		AM.validateResetLink(user, uuid, function(e){
			if (e != 'ok'){
				//res.redirect('/');
				res.render('passwd.ejs', { msg: res.__('forgot_password_error'), msg_color: 'red', msg2: 'Token caducado, intentelo de nuevo'});
			} else{
				res.render('reset-passwd.ejs', {user:user, msg: '', msg_color: 'black'});
				/*res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ 
					res.render('reset-password.ejs', {user:user});
				});*/
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var user = req.body['user'];
		var nPass = req.body['pass'];
		//console.log("-->user:" + user);
		req.session.destroy();
		AM.updatePassword(user, nPass, function(e, o){
			if (o){
				//res.status(200).send('ok');
				res.render('login.ejs', { msg: res.__('password_updated'), msg_color: 'green'});
			}	else{
				res.render('reset-passwd.ejs', {user:user, msg: res.__('update_password_error'), msg_color: 'red'});
			}
		})
	});
	
// view & delete accounts //
	/*
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	*/

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

    //app.use(express.static(__dirname + '/public'));
};
