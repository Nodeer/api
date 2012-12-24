var mongo = require('mongodb');

var bcrypt = require('bcrypt')
// use moment.js for pretty date-stamping //
var moment = require('moment');

var Server = mongo.Server,
    BSON = mongo.BSONPure;

//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('login-testing', server);


var express = require("express");
var app = express.createServer();
//var app = express();

var AM = {}; 

//mongodb://<dbuser>:<dbpassword>@ds037827.mongolab.com:37827/taxivn
//https://mongolab.com/databases/taxivn#users
app.configure('production', function(){
    mongo = {
        "hostname":"ds037827.mongolab.com",
        "port":37827,
        "username":"trong",
        "password":"123456",
        "name":"",
        "db":"taxivn"
    }
});
app.configure('development', function(){
    mongo = {
        "hostname":"ds037827.mongolab.com",
        "port":37827,
        "username":"trong",
        "password":"123456",
        "name":"",
        "db":"taxivn"
    }
});

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
    	console.log("mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db);
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
    	console.log("mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db);
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);
var db;

require('mongodb').connect(mongourl, function(err, conn){
	db = conn;
	AM.accounts = db.collection('accounts');
	AM.drivers = db.collection('drivers');
	AM.clients = db.collection('clients');
});


//////////////////--Helper--//////////////////
var replaceItemInArray = function(array,oldItem,newItem) {
	//console.log('-array' + array + '-old:' + oldItem + "new:" + newItem) ;

	var index = array.indexOf(oldItem);

	console.log('-check' + index);
	if ( oldItem == null || newItem == null) {
		return array;
	} else if (typeof(oldItem) == undefined || typeof(newItem) == undefined) {
		return array;
	} else if (index >= 0) {
		array.splice(index,1,newItem);
	} 
	//console.log('-arrayafter:' + array);
	return array;
}

var insertItemInArray = function(array,item) {
	//console.log('-array' + array + '-item' + item);

	//console.log('-check' + array.indexOf(item));
	if ( item == null ) {
		return array;
	} else if (typeof(item) == undefined) {
		return array;
	} else if (array.indexOf(item) < 0) {
		array.push(item);
	} 
	return array;
}

var deleteItemInArray = function(array,item) {
	//console.log('-array' + array + '-item' + item);

	//console.log('-check:' + array.indexOf(item));
	var index = array.indexOf(item);
	if (index < 0) {
		//array.push(item);
	} else {
		array.splice(index,1);
	}
	//console.log('-arrayafter:' + array);

	return array;
}

//var DB = require('./dbModule');

// constructor call
//var object = new DB("accounts");

//AM.accounts = DB.AM; 

module.exports = AM;

// logging in //

// AM.autoLogin = function(user, pass, callback)
// {
// 	AM.accounts.findOne({user:user}, function(e, o) {
// 		if (o){
// 			o.pass == pass ? callback(o) : callback(null);
// 		}	else{
// 			callback(null);
// 		}
// 	});
// }

// AM.manualLogin = function(user, pass, callback)
// {
// 	AM.accounts.findOne({user:user}, function(e, o) {
// 		if (o == null){
// 			callback('user-not-found');
// 		}	else{
// 			bcrypt.compare(pass, o.pass, function(err, res) {
// 				if (res){
// 					callback(null, o);
// 				}	else{
// 					callback('invalid-password');
// 				}
// 			});
// 		}
// 	});
// }

// AM.manualLoginWithType = function(user, pass, usertype, callback)
// {
// 	AM.accounts.findOne({user:user,usertype:usertype}, function(e, o) {
// 		if (o == null){
// 			callback('user-not-found');
// 		}	else{
// 			bcrypt.compare(pass, o.pass, function(err, res) {
// 				if (res){
// 					callback(null, o);
// 				}	else{
// 					callback('invalid-password');
// 				}
// 			});
// 		}
// 	});
// }

AM.manualLogin = function(user, pass, usertype, callback)
{

	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

	tbAccounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			bcrypt.compare(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

// record insertion, update & deletion methods //

// AM.signup = function(newData, callback)
// {
// 	AM.accounts.findOne({user:newData.user}, function(e, o) {
// 		console.log('user: ' + JSON.stringify(newData));
// 		if (o){
// 			console.log('username-taken: ' + o);
// 			callback('username-taken',null);
// 		}	else{
// 			AM.accounts.findOne({email:newData.email}, function(e, o) {
// 				if (o){
// 					callback('email-taken',null);
// 				}	else{
// 					AM.saltAndHash(newData.pass, function(hash){
// 						newData.pass = hash;
// 					// append date stamp when record was created //
// 						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
// 						AM.accounts.insert(newData, function(e, o) {
// 							if (e) {
// 								callback(e,null);
// 							}	else {	
// 								callback(null,o);
// 							}
// 						});
// 					});
// 				}
// 			});
// 		}
// 	});
// }

AM.signup = function(newData,usertype,callback)
{

	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}
	
	//if ( typeof(newData.devicetoken) != undefined && newData.devicetoken != null) {
		var deviceToken = newData.devicetoken;
		delete newData['devicetoken'];
		console.log("device:" + deviceToken + "sadasdsd=" + newData);
		var devices = { 
			"iOS":[deviceToken]
		}
		newData.devices = devices;
	//}

	tbAccounts.findOne({user:newData.user}, function(e, o) {
		console.log('user: ' + JSON.stringify(newData));
		if (o){
			console.log('username-taken: ' + o);
			callback('username-taken',null);
		}	else{
			tbAccounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken',null);
				}	else{
					AM.saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						tbAccounts.insert(newData, function(e, o) {
							if (e) {
								callback(e,null);
							}	else {	
								callback(null,o);
							}
						});
					});
				}
			});
		}
	});
}

// AM.update = function(newData, callback)
// {
// 	AM.accounts.findOne({user:newData.user}, function(e, o){
// 		o.name 		= newData.name;
// 		o.email 	= newData.email;
// 		o.country 	= newData.country;
// 		o.usertype  = newData.usertype;
// 		if (newData.pass == ''){
// 			AM.accounts.save(o); callback(o);
// 		}	else{
// 			AM.saltAndHash(newData.pass, function(hash){
// 				o.pass = hash;
// 				AM.accounts.save(o); callback(o);
// 			});
// 		}
// 	});
// }


// AM.updateDriver = function(newData, callback)
// {
// 	AM.drivers.findOne({user:newData.user}, function(e, o){
// 		o.name 		= newData.name;
// 		o.email 	= newData.email;
// 		o.country 	= newData.country;
// 		o.usertype  = newData.usertype;
// 		if (newData.pass == ''){
// 			AM.drivers.save(o); callback(o);
// 		}	else{
// 			AM.saltAndHash(newData.pass, function(hash){
// 				o.pass = hash;
// 				AM.drivers.save(o); callback(o);
// 			});
// 		}
// 	});
// }

// AM.updateClient = function(newData, callback)
// {
// 	AM.clients.findOne({user:newData.user}, function(e, o){
// 		o.name 		= newData.name;
// 		o.email 	= newData.email;
// 		o.country 	= newData.country;
// 		o.usertype  = newData.usertype;
// 		if (newData.pass == ''){
// 			AM.clients.save(o); callback(o);
// 		}	else{
// 			AM.saltAndHash(newData.pass, function(hash){
// 				o.pass = hash;
// 				AM.clients.save(o); callback(o);
// 			});
// 		}
// 	});
// }

AM.setPassword = function(email, newPass, callback)
{
	AM.accounts.findOne({email:email}, function(e, o){
		AM.saltAndHash(newPass, function(hash){
			o.pass = hash;
			AM.accounts.save(o); callback(o);
		});
	});
}

AM.validateLink = function(email, passHash, callback)
{
	AM.accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

AM.saltAndHash = function(pass, callback)
{
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(pass, salt, function(err, hash) {
			callback(hash);
		});
	});
}

AM.delete = function(id, callback)
{
	AM.accounts.remove({_id: this.getObjectId(id)}, callback);
}

// auxiliary methods //

AM.getEmail = function(email, callback)
{
	AM.accounts.findOne({email:email}, function(e, o){ callback(o); });
}

AM.getObjectId = function(id,usertype)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}
	return tbAccounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.getAllRecords = function(usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}
	tbAccounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

// AM.delAllRecords = function(id, callback)
// {
// 	AM.accounts.remove(); // reset accounts collection for testing //
// }

// just for testing - these are not actually being used //

AM.findById = function(id, usertype, callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

	tbAccounts.findOne({_id: this.getObjectId(id,usertype)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AM.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	AM.accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}

AM.updateLocation = function(id, Location, usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients;
	}

    console.log('Updating Location for userID: ' + id); 
    console.log(JSON.stringify(Location));
    
    //http://stackoverflow.com/questions/5892569/responding-a-json-object-in-nodejs
    
    var now = new Date();
	var jsonDate = now.toJSON();

	var info =  { 
      "loc": Location.loc, 
      "uptime": jsonDate, 
    };
  
  	console.log('current time: ' + jsonDate); 
  	console.log(JSON.stringify(info));
	
	tbAccounts.find(function(e, o){
        tbAccounts.update({'_id':new BSON.ObjectID(id)}, {$set: info}, {safe:true}, function(e, o) {
            if (e) {
            	console.log(e);
				callback(e,null);
            } else {
                callback(null,o);
            }
        });
    });
}

AM.updateStatus = function(id, Status, usertype, callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients;
	}

    console.log('Updating Status for userID: ' + id); 

    //http://stackoverflow.com/questions/5892569/responding-a-json-object-in-nodejs
    
    var now = new Date();
	var jsonDate = now.toJSON();

	var info =  { 
      "status": Status, 
      "uptime": jsonDate, 
    };
  
  	console.log('current time: ' + jsonDate); 
  	console.log(JSON.stringify(info));
	
	tbAccounts.find(function(e, o){
        tbAccounts.update({'_id':new BSON.ObjectID(id)}, {$set: info}, {safe:true}, function(e, o) {
            if (e) {
            	console.log(e);
				callback(e,null);
            } else {
                callback(null,o);
            }
        });
    });
}

AM.freeUpdate = function(newData, usertype, callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients;
	}

	tbAccounts.findOne({user:newData.user}, function(e, o){
		for(var attributename in newData){
    		console.log("- updating:" + attributename+": "+newData[attributename]);
			o[attributename] = newData[attributename];
			if (newData.pass == ''){
				tbAccounts.save(o); callback(null,o);
			}	else{
				AM.saltAndHash(newData.pass, function(hash){
					o.pass = hash;
					tbAccounts.save(o); callback(null,o);
				});
			}
		}
	});
}

AM.addDeviceToken = function(id,deviceToken,usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

	tbAccounts.findOne({_id: this.getObjectId(id,usertype)}, function(e, o) {
		if (e || !o) callback(e,null)
		else {
			var devices = { 
				"iOS":[deviceToken]
			}
			
			if (o.devices == null) {
				o.devices = devices;
			} else {
				o.devices.iOS = insertItemInArray(o.devices.iOS,deviceToken);
			}
			tbAccounts.save(o); callback(null,o);
		}
	});
}

AM.deleteDeviceToken = function(id,deviceToken,usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

	tbAccounts.findOne({_id: this.getObjectId(id,usertype)}, function(e, o) {
		if (e || !o) callback(e,null)
		else {
			if (o.devices == null) {
				callback(null,null);
			} else {
				//console.log("1="+JSON.stringify(o.devices.iOS));
				//console.log("2="+deviceToken);
				o.devices.iOS = deleteItemInArray(o.devices.iOS,deviceToken);
				console.log("3="+o.devices.iOS);
				tbAccounts.save(o); callback(null,o);
			}
		}
	});
}


AM.updateDeviceToken = function(id,olddeviceToken,deviceToken,usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

	tbAccounts.findOne({_id: this.getObjectId(id,usertype)}, function(e, o) {
		if (e || !o) callback(e,null)
		else {
			if (o.devices == null) {
				callback(null,null);
			} else {
				o.devices.iOS = replaceItemInArray(o.devices.iOS,olddeviceToken,deviceToken);
				//o.devices.iOS = deleteItemInArray(o.devices.iOS,olddeviceToken);
				tbAccounts.save(o); callback(null,o);
			}
		}
	});
}


AM.addLocations = function(id,locations,usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

	console.log("xxxxxxxx" + locations);
	tbAccounts.findOne({_id: this.getObjectId(id,usertype)}, function(e, o) {
		if (e || !o) callback(e,null)
		else {
			if (o.savedlocations == null) {
				o.savedlocations = locations;
			} else {
				for (var i = locations.length - 1; i >= 0; i--) {
					o.savedlocations = insertItemInArray(o.savedlocations,locations[i]);
				};
			}
			tbAccounts.save(o); callback(null,o);
		}
	});
}

AM.deleteLocations = function(id,locations,usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}
	console.log("xxxxxxxx" + locations);
	tbAccounts.findOne({_id: this.getObjectId(id,usertype)}, function(e, o) {
		if (e || !o) callback(e,null)
		else {
			if (o.savedlocations == null) {
				callback(null,null);
			} else {
				for (var i = locations.length - 1; i >= 0; i--) {
					o.savedlocations = deleteItemInArray(o.savedlocations,locations[i]);
				};
				tbAccounts.save(o); callback(null,o);
			}
		}
	});
}

AM.rating = function(id,like,usertype,callback)
{
	var tbAccounts = AM.accounts;
	if (usertype == 1) {
		tbAccounts = AM.drivers;
	} else if (usertype == 0){
		tbAccounts = AM.clients
	}

    var info =  { "rating":
		{ 
		  "like": 0, 
		  "dislike": 0 
		}
	}
	tbAccounts.findOne({_id: this.getObjectId(id,usertype)},
		function(e, o) {
		if (e) {
            console.log(e);
			callback(e,null);
        } else {    
			if (o.rating == null) {
				if (like == 1) {
					info.rating.like = info.rating.like + 1;
				} else {
					info.rating.dislike =  info.rating.dislike + 1;
				}
				o.rating = info.rating;
			} else {
				if (like == 1) {
					o.rating.like = o.rating.like + 1;
				} else {
					o.rating.dislike =  o.rating.dislike + 1;
				}
				info.rating = o.rating;
			}
			//o.rating = info.rating;
			//console.log("info:" + info.rating);
			tbAccounts.save(o); callback(null,o);
		}
    });
}

AM.findByDistance = function(Location, number, conditions, usertype, callback) 
{
	var tbAccounts = 'accounts';
	if (usertype == 1) {
		tbAccounts = 'clients';
	} else if (usertype == 0){
		tbAccounts = 'drivers'
	}

	// convert conditions to object
	var con = conditions;
	if (typeof conditions !== 'object') {
		con = JSON.parse(conditions);
	}
	
	var loc = Location;
	if (typeof conditions !== 'object') {
		// convert location to array: https://groups.google.com/forum/?fromgroups=#!topic/mongodb-user/Iji6ui_oSdw
		var locArray = Location.split(",");
		
		// convert string to float for lat and lon
		loc = [parseFloat(locArray[0],10),parseFloat(locArray[1],10)];
	}
	
    db.command({geoNear: tbAccounts, near: loc, distanceMultiplier: 3963, spherical: true, num: number,
    	query:{
			$and:[
					con
				]
			}
		}, function(e, o) {
		if (e) { 
			console.log(e);
			callback(e,null);
		}
		else {
			callback(null,o);
		}
    });
};

