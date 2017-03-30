var crypto 		= require('crypto');
var mysql     = require('mysql');
var moment 		= require('moment');
var crypt     = require('crypt3');
var uuid      = require('node-uuid');
var mongoose  = require('mongoose');

var PropertiesReader = require('properties-reader');

var properties = PropertiesReader('./kyrosview.properties');

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

/*
	ESTABLISH DATABASE CONNECTION
*/

var colors = require('colors');

var dbMysqlName = properties.get('bbdd.mysql.name');
var dbMysqlHost = properties.get('bbdd.mysql.ip');
var dbMysqlPort = properties.get('bbdd.mysql.port');
var dbMysqlUser = properties.get('bbdd.mysql.user');
var dbMysqlPass = properties.get('bbdd.mysql.passwd');

var dbConfig = {
    host: dbMysqlHost,
    user: dbMysqlUser,
    password: dbMysqlPass,
    database: dbMysqlName,
    connectionLimit: 50,
    queueLimit: 0,
    waitForConnection: true
};

var pool = mysql.createPool(dbConfig);

var dbMongoName = properties.get('bbdd.mongo.name');
var dbMongoHost = properties.get('bbdd.mongo.ip');
var dbMongoPort = properties.get('bbdd.mongo.port');

mongoose.createConnection('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, function (error) {
    if (error) {
        log.info(error);
    }
});

exports.autoLogin = function(user, pass, callback)
{
    pool.getConnection(function(err, connection) {
        if (connection) {        
            var sql = "SELECT USERNAME as username, PASSWORD as password, EMAIL as email, FIRSTNAME as firstname, LASTNAME as lastname, LANGUAGE_USER as lang, DATE_END as dateEnd, BLOCKED as blocked FROM USER_GUI WHERE USERNAME= '" + user + "'";
            //console.log(colors.green('Query: %s'), sql);
            connection.query(sql, function(error, rows)
            {
              connection.release();
              if(error)
              {
                  //callback('user-not-found');
                  callback(null);
              }
              else
              {
                  var passDB = rows[0].password;                  
                  if( crypt(pass,passDB) !== passDB) {
                     callback(null);
                  } else {
                    callback(null, rows[0]);
                  }
              }
            });
        } else {
            callback(null);
        }
    });        
}

exports.manualLogin = function(user, pass, callback) 
{
    pool.getConnection(function(err, connection) {
        if (connection) {        
            var sql = "SELECT USERNAME as username, PASSWORD as password, EMAIL as email, FIRSTNAME as firstname, LASTNAME as lastname, LANGUAGE_USER as lang FROM USER_GUI WHERE USERNAME= '" + user + "'";
            //console.log(colors.green('Query: %s'), sql);
            connection.query(sql, function(error, rows)
            {
              if(error)
              {
                  //console.log(colors.red('Query error: %s'), error);
                  callback(null);
              }
              else
              {
                  if (rows[0]==undefined) {
                    callback('loginError');
                  } else {
                    var passDB = rows[0].password;  
                    if( crypt(pass, passDB) !== passDB) {
                       callback(null);
                    } else {

                      // Ver si es usuario LITE o PRO (si tiene o no la funcionalidad 20)
                      var sqlLite = "SELECT * FROM USER_FUNCTIONALITY where FUNCTIONALITY_ID=20 and USER_NAME= '" + user + "'";                      
                      connection.query(sqlLite, function(error, rowsLite)
                      {
                        connection.release();
                        if(error)
                        {
                            //console.log(colors.red('Query error: %s'), error);
                            callback(null);
                        }
                        else
                        {
                          if (rowsLite[0]!=undefined) {
                            // es usuario PRO
                            //console.log(rows[0]);
                            rows[0]['user_type'] = "PRO";
                          } else {
                            // es usuario LITE
                            rows[0]['user_type'] = "LITE";
                          }
                          // comprobar si existe en la bbdd de mongo
                          mongoose.connection.db.collection('USER', function (err, collection) {
                            collection.find({"username" : user}).toArray(function(err, docs) {
                                if (docs.length==0) {
                                    user_mongo = {
                                      "username" : user,
                                      "password" : rows[0]['password'],
                                      "firstname" : rows[0]['firstname'],
                                      "language" : rows[0]['lang'],
                                      "vehicle_license" : "",
                                      "device_id": 0,
                                      "push_enabled" : 1,
                                      "group_notifications" : 0,
                                      "token" : "",
                                      "push_limit" : 50,
                                      "lastname" : rows[0]['lastname'],
                                      "date_end" : rows[0]['dateEnd'],
                                      "email" : rows[0]['email'],
                                      "blocked" : rows[0]['blocked']
                                    }
                                    collection.save(user_mongo);
                                  }
                                callback(null, rows[0]);
                              });
                          });
                        }
                      });
                          
                    }
                  }
              }
            });
        } else {
            callback(null);
        }
    });            
}

exports.loadDefaultVehicle = function(username, callback) 
{
    mongoose.connection.db.collection('USER', function (err, collection) {
        collection.find({"username" : username}).toArray(function(err, docs) {
          if (docs[0].device_id == undefined) {
            callback("");
          } else {
            callback(docs[0].device_id);
          }
        });
  });

}

/* record insertion, update & deletion methods */
exports.addNewAccount = function(newData, callback)
{
    pool.getConnection(function(err, connection) {
        if (connection) {        
            var sqlUser = "SELECT * FROM USER_GUI WHERE USERNAME= '" + newData.user + "'";
            //console.log(colors.green('Query: %s'), sqlUser);
            connection.query(sqlUser, function(error, row) {
              if(error) {
                callback('db-error');
              } else {
                  if(row[0] != undefined) {
                      callback('username-taken');
                  } else {
                      var sqlEmail = "SELECT * FROM USER_GUI WHERE EMAIL= '" + newData.email + "'";
                      //console.log(colors.green('Query: %s'), sqlEmail);
                      connection.query(sqlEmail, function(error, row2) {
                      if(error) {
                        callback(null);
                      } else {
                        if(row[0] != undefined) {
                            callback('email-taken');
                        } else {
                            saltAndHash(newData.pass, function(hash){
          						      newData.pass = hash;
          					          // append date stamp when record was created //
          						      newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						                var cryptPass = crypt(newPass);
					                  var sqlInsert = "INSERT INTO USER_GUI SET EMAIL= '" + newData.email + "',USERNAME='" + newData.user + "',PASSWORD='" + cryptPass + "' ,CREATED='" + newData.date + "'";
                               //console.log(colors.green('Query: %s'), sqlInsert);
                               connection.query(sqlInsert, function(error, result) {
                                connection.release();
                                if(error) {
                                    callback('db-error');
                                } else {
                                    callback(null);
                                }					                                   
                                }); // insert
                            });  // saltAndHash
                        }
                      }
                    }); // sqlEmail                      
                    }
                }
                }); // sqlUsername  
        } else { // connection
            callback('db-error');
        }
    });            
}

exports.updateAccount = function(newData, callback)
{ 
    pool.getConnection(function(err, connection) {
        if (connection) {     
            var cryptPass = crypt(newData.pass, newData.passOld);   
            var sql = "UPDATE USER_GUI set UUID='0', FIRSTNAME='" + newData.firstname + "',LASTNAME='" + newData.lastname + "' ,PASSWORD='" + cryptPass + "',EMAIL='" + newData.email + "' WHERE USERNAME= '" + newData.user + "'";
            //console.log(colors.green('Query: %s'), sql);
            connection.query(sql, function(error, result)
            {
              connection.release();
              if(error)
              {
                  //console.log(colors.red('Query error: %s'), error);
                  callback('db-error');
              }
              else
              {
                  callback(null);
              }
            });
        } else {
            callback('db-error');
        }
    });            
}

exports.updateUserDevice = function(newData, callback)
{
  mongoose.connection.db.collection('USER', function (err, collection) { 
      collection.update({ username: newData.username }, { $set: { device_id: parseInt(newData.deviceId) }}, function (err, doc) {
        if(err) {
            //console.log(colors.red('updateUserDevice error: %s'), err);
            callback('error');
        }
        else {
          callback('ok', 'ok');
        }
      });    
  });           
}

exports.generateUserUUID = function(user, callback)
{
    pool.getConnection(function(err, connection) {
        if (connection) {    
            user.uuid = uuid.v1();    
            var sql = "UPDATE USER_GUI set UUID='" + user.uuid + "' WHERE USERNAME= '" + user.user + "'";   
            connection.query(sql, function(error, result)
            {
              connection.release();
              if(error)
              {
                  callback(null);
              }
              else
              {
                  callback(user);
              }
            });
        } else {
            callback(null);
        }
    });            
}

exports.updatePassword = function(user, newPass, callback)
{
     pool.getConnection(function(err, connection) {
        if (connection) {        
            var sql = "SELECT USERNAME as user, PASSWORD as pass FROM USER_GUI WHERE USERNAME= '" + user + "'";
            connection.query(sql, function(error, rows)
            {
              if(error || rows[0]==undefined)
              {
                  callback(error, null);
              }
              else
              {
                  // actualizar la password
                    var cryptPass = crypt(newPass, rows[0].pass);
                    var sqlUpdate = "UPDATE USER_GUI set UUID='0', PASSWORD='" + cryptPass + "' WHERE USERNAME= '" + user + "'";
                    connection.query(sqlUpdate, function(error, result)
                    {
                        connection.release();
                        if(error) {
                            callback(error, null);
                        } else {
                            callback('ok', 'ok');
                        }
                    });  // update
              }
            });
        } else {
            callback('error', null);
        }
    });               
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
     pool.getConnection(function(err, connection) {
        if (connection) {        
            var sql = "SELECT USERNAME as user, PASSWORD as pass, EMAIL as email FROM USER_GUI WHERE EMAIL= '" + email + "'";
            connection.query(sql, function(error, rows)
            {
              connection.release();
              if(error)
              {
                  callback('user-not-found');
              }
              else
              {
                  callback(rows[0]);
              }
            });
        } else {
            callback(null);
        }
    });           
}

exports.getAccountByUsername = function(username, callback)
{
     pool.getConnection(function(err, connection) {
        if (connection) {        
            var sql = "SELECT USERNAME as user, FIRSTNAME as name, PASSWORD as pass, EMAIL as email FROM USER_GUI WHERE USERNAME= '" + username + "'";
            connection.query(sql, function(error, rows)
            {
              connection.release();
              if(error)
              {
                callback(null);
              }
              else
              {
                  callback(rows[0]);
              }
            });
        } else {
            callback(null);
        }
    });           
}

exports.validateResetLink = function(user, uuid, callback)
{
    pool.getConnection(function(err, connection) {
        if (connection) {        
            var sql = "SELECT * FROM USER_GUI WHERE USERNAME= '" + user + "' and UUID='" + uuid + "'" ;
            connection.query(sql, function(error, rows)
            {
              connection.release();
              if(error || rows[0]==undefined)
              {
                  callback(null);
              }
              else
              {
                  callback('ok');
              }
            });
        } else {
            callback(null);
        }
    });      
    
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
