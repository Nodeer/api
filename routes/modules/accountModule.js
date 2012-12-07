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
});

//var DB = require('./dbModule');

// constructor call
//var object = new DB("accounts");

//AM.accounts = DB.AM; 

module.exports = AM;

// logging in //

AM.autoLogin = function(user, pass, callback)
{
	AM.accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

AM.manualLogin = function(user, pass, callback)
{
	AM.accounts.findOne({user:user}, function(e, o) {
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

AM.signup = function(newData, callback)
{
	AM.accounts.findOne({user:newData.user}, function(e, o) {
		console.log('user: ' + newData);
		if (o){
			console.log('username-taken: ' + o);
			callback('username-taken');
		}	else{
			AM.accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					AM.saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						AM.accounts.insert(newData, callback(null));
					});
				}
			});
		}
	});
}

AM.update = function(newData, callback)
{
	AM.accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		o.usertype  = newData.usertype;
		if (newData.pass == ''){
			AM.accounts.save(o); callback(o);
		}	else{
			AM.saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				AM.accounts.save(o); callback(o);
			});
		}
	});
}

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

AM.getObjectId = function(id)
{
	return AM.accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.getAllRecords = function(callback)
{
	AM.accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AM.delAllRecords = function(id, callback)
{
	AM.accounts.remove(); // reset accounts collection for testing //
}

// just for testing - these are not actually being used //

AM.findById = function(id, callback)
{
	AM.accounts.findOne({_id: this.getObjectId(id)},
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

AM.updateLocation = function(id, Location, callback)
{
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
	
	AM.accounts.find(function(e, o){
        AM.accounts.update({'_id':new BSON.ObjectID(id)}, {$set: info}, {safe:true}, function(e, o) {
            if (e) {
            	console.log(e);
				callback(e,null);
            } else {
                callback(null,o);
            }
        });
    });
}

AM.updateStatus = function(id, Status, callback)
{
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
	
	AM.accounts.find(function(e, o){
        AM.accounts.update({'_id':new BSON.ObjectID(id)}, {$set: info}, {safe:true}, function(e, o) {
            if (e) {
            	console.log(e);
				callback(e,null);
            } else {
                callback(null,o);
            }
        });
    });
}

AM.findByDistance = function(Location, number, conditions, callback) 
{
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
	
    db.command({geoNear: 'accounts', near: loc, distanceMultiplier: 3963, spherical: true, num: number,
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

