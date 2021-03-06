
var CT = require('../modules/country-list');
var AM = require('../modules/account-manager');
var EM = require('../modules/email-dispatcher');


var colors = require('colors');

module.exports = function(app) {

    // set the view engine to ejs and jade
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
					//console.log("FIJAR COOKIE -1 ");
				    //res.cookie('kyrosview_lang', 'en', { maxAge: 900000, httpOnly: true });

				    // consultar vehiculo por defecto
				    AM.loadDefaultVehicle(req.cookies.user , function(data){
						if (data != null){
				    		req.session.user.device_id = data;
				    		res.redirect('/map');
				    		//res.redirect('/blur/index.html');
				   		} else {
				   			res.render('login.ejs', { msg: '', msg_color: 'black'});
				   		} 

				    }); 
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

				// FIJAR EL IDIOMA
				//Con los idiomas hay 2 opciones: usar el que tenga configurado el usuario en kyros o usar el seleccionado en la pantalla de login
				//Se utiliza una mezcla: se usa la opcion 2 pero si no se fija uno en la ventana de login se usa el idioma por defecto del usuario
				//opcion 1:
				//res.cookie('kyrosview_lang', o.lang, { maxAge: 900000, httpOnly: true });
				
				//opcion 2:
				var lang = req.body['lang'];
				if (lang=="undefined") {
					lang = o.lang;
				}
				res.cookie('kyrosview_lang', lang, { maxAge: 900000, httpOnly: true });

				//SESION POR COOKIE
				/*if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}*/

				// consultar vehiculo por defecto
				AM.loadDefaultVehicle(req.body['user'] , function(data){
					if (data != null){
				    	req.session.user.deviceId = data;
				    	req.session.user_type = o['user_type'];
				    	res.redirect('/map');
				   	} else {
				   		res.render('login.ejs', { msg: '', msg_color: 'black'});
				   	} 

				}); 
			}
		});
	});
	
	app.get('/mobile', function(req, res){
		res.render('login-mobile.ejs', { msg: '', 	msg_color: 'black'});
	});

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
			res.redirect('/');
		}	else{
            //console.log(req.session.user.lastname);
			if (req.session.user.lastname=='blur') {
        		res.render('index.html');
        		/*res.render('blur.ejs', {
	            	msg : '',
	                user : req.session.user.username,
	                deviceId : req.session.user.deviceId,
	                user_type : req.session.user.user_type
				});*/
			} else {
	            res.render('map.ejs', {
	            	msg : '',
	                user : req.session.user.username,
	                deviceId : req.session.user.deviceId,
	                user_type : req.session.user.user_type
				});
			}
            
            
		}
	});

	app.get('/map-mobile', function(req, res) {
		if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
			res.redirect('/mobile');
		}	else{
            res.render('map.ejs', {
            	msg : '',
                user : req.session.user.username,
                deviceId : req.session.user.deviceId,
                user_type : req.session.user.user_type
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
                deviceId : req.session.user.deviceId,
                user_type : req.session.user.user_type                
			});            
		}
	});

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

    app.post('/graphs-hist', function(req, res) {
		if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
            res.render('graphs-hist.ejs', {
                user : req.session.user.username,
                //deviceId : req.session.user.deviceId,
                deviceId : req.body['deviceId'],
                initDate : req.body['initDate'],
                endDate : req.body['endDate']
			});
            
		}
	});

	app.post('/map', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateUserDevice({
				username : req.session.user.username,
				deviceId : req.body['deviceId']
			}, function(e, o){
				if (e!='ok'){
					res.render('map.ejs', {
						msg: res.__('select_vehicle_error'),
						msg_color: 'red',
						user : req.session.user.username,
						deviceId : req.session.user.deviceId,
						user_type : req.session.user.user_type
					});

				}	else{
					req.session.user.deviceId = req.body['deviceId']; 
					res.render('map.ejs', {
						msg: res.__('device_selected'),

                		user : req.session.user.username,
                		deviceId : req.body['deviceId'],
                		user_type : req.session.user.user_type
					});					
				}
			});
		}
	});

	app.get('/home', function(req, res) {
		if (req.session.user == null){
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
	});
	


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
				res.render('passwd.ejs', { msg: res.__('user_not_exist'), msg_color: 'red', msg2: ''});
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
