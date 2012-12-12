//var express = require('express'),
    //account = require('./routes/account');
var AM = require('../modules/accountModule');;

var apns = require('apn');


var options = {
    cert: './routes/certificates/Visikard_development_cert.pem',                 /* Certificate file path */
    certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    key:  './routes/certificates/VisikardKey.pem',                  /* Key file path */
    keyData: null,                    /* String or Buffer containing key data, as certData */
    passphrase: 'visikard@123',                 /* A passphrase for the Key file */
    ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */
    errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
};

var apnsConnection = new apns.Connection(options);

var myToken = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';

var myDevice = new apns.Device(myToken);

exports.simplePush = function(req, res) 
{
	var note = new apns.Notification();

	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null) {
	   note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null) {
	   note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null) {
       note.payload = {'messageFrom': 'Caroline'};
    } else {
        note.payload = req.payload;   
    }
	//note.payload = {'messageFrom': 'Caroline'};
    var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    if (req.token == null) {
    } else {
        token = req.token; 
    }
    var device = new apns.Device(token);
    note.device = device;   
	//note.device = myDevice;

	apnsConnection.sendNotification(note);
	res.send(note, 200);
};

push = function(req, token, callback) 
{
    var note = new apns.Notification();

    console.log(JSON.stringify(req) + req.badge);

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null) {
       note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null) {
       note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null) {
       note.payload = {'messageFrom': 'Caroline'};
    } else {
        note.payload = req.payload;   
    }
    //note.payload = {'messageFrom': 'Caroline'};
    //var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    //if (req.token == null) {
    //} else {
    //    token = req.token; 
    //}
    //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
    var device = new apns.Device(token);
    note.device = device;   
    //note.device = myDevice;

    apnsConnection.sendNotification(note);
    callback(null,note);
};

exports.pushToRequestTaxi = function(req, res) 
{
    var id = req.params.id;
    var retdata = {};

    //console.log(JSON.stringify(req.body));

    AM.findById(id,function(e, o) {
        if (!o) {
            retdata.msg = e;
            res.send(retdata, 400);
        }   else {
            for (var i = o.devices.iOS.length - 1; i >= 0; i--) {
                //var request = req.body;
                var token = o.devices.iOS[i];
                push(req.body,token,function(e, o) {
                    if (e) {
                        //retdata.msg = e;
                        //res.send(retdata, 400);
                    } else {
                        console.log("push: " + i + " - " + o);
                    }  
                });
            };

            // retdata = o;
            retdata.msg = 'ok';
            res.send(retdata, 200);

        }
    }); 
};

