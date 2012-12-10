//var express = require('express'),
    //account = require('./routes/account');
//var    AM = require('../modules/accountModule');;

var apns = require('apn');


var options = {
    cert: './routes/certificates/cert.pem',                 /* Certificate file path */
    certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    key:  './routes/certificates/key.pem',                  /* Key file path */
    keyData: null,                    /* String or Buffer containing key data, as certData */
    passphrase: 'chua83',                 /* A passphrase for the Key file */
    ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */
    errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
};

var apnsConnection = new apns.Connection(options);

var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';

var myDevice = new apns.Device(token);

exports.simplePush = function(req, res) 
{
	var note = new apns.Notification();

	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 3;
	//note.sound = "ping.aiff";
	note.alert = "You have a new message";
	note.payload = {'messageFrom': 'Caroline'};
	note.device = myDevice;

	apnsConnection.sendNotification(note);
	res.send(note, 200);
};
