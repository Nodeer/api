var express = require('express'),
    //account = require('./routes/account');
    account = require('./routes/controllers/accountController');
    apns = require('./routes/controllers/apnController');

var app = express.createServer();
//var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(require('connect').bodyParser());
});

// USER
	//http://taxivnapi.rs.af.cm/accounts/signup/driver/signup
	app.post('/accounts/driver/signup', account.signUpDriver);
	//http://taxivnapi.rs.af.cm/accounts/signup/driver/signup
	app.post('/accounts/client/signup', account.signUpClient);
	//curl -X POST -H 'Content-Type: application/json' -d'{"user":"trong", "pa":"123456"}' http://localhost:3001/accounts/login
	app.post('/accounts/driver/login', account.loginWithDeviceTokenDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"user":"trong", "pa":"123456"}' http://localhost:3001/accounts/login
	app.post('/accounts/client/login', account.loginWithDeviceTokenClient);
	//curl -X POST  http://localhost:3001/accounts/logout/50a1be6e7028797132000001
	app.post('/accounts/driver/logout/:id', account.logoutWithDeviceTokenDriver);
	app.post('/accounts/client/logout/:id', account.logoutWithDeviceTokenClient);
	//http://taxivnapi.rs.af.cm/accounts/
	app.get('/accounts/driver', account.findAllDriver);
	//http://taxivnapi.rs.af.cm/accounts/
	app.get('/accounts/client', account.findAllClient);
	//http://taxivnapi.rs.af.cm/accounts/50a1be6e7028797132000001
	app.get('/accounts/driver/:id', account.findByIdDriver);
		//http://taxivnapi.rs.af.cm/accounts/50a1be6e7028797132000001
	app.get('/accounts/client/:id', account.findByIdClient);

	//curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [106.638966,10.827257] }' http://taxivnapi.rs.af.cm/accounts/location/50a1be6e7028797132000001
	app.post('/accounts/driver/location/:id', account.updateLocationDriver);
	app.post('/accounts/client/location/:id', account.updateLocationClient);

	//curl -i -X POST -H 'Content-Type: application/json' -d'{"status":"1"}' http://localhost:3001/accounts/status/50a1be6e7028797132000001
	app.post('/accounts/driver/status/:id', account.updateStatusDriver);
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"status":"1"}' http://localhost:3001/accounts/status/50a1be6e7028797132000001
	app.post('/accounts/client/status/:id', account.updateStatusClient);
	

	//curl -X POST -H 'Content-Type: application/json' -d'{"user":"trong", "pass":"123456","seat":"8" }' http://localhost:3001/accounts/info
	app.post('/accounts/driver/info', account.updateInfoDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"user":"trong", "pass":"123456","seat":"8" }' http://localhost:3001/accounts/info
	app.post('/accounts/client/info', account.updateInfoClient);

	//curl -X POST -H 'Content-Type: application/json' -d'{"like":"0"}' http://localhost:3001/accounts/rating/50a1be6e7028797132000001
	app.post('/accounts/driver/rating/:id', account.ratingDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"like":"0"}' http://localhost:3001/accounts/rating/50a1be6e7028797132000001
	app.post('/accounts/client/rating/:id', account.ratingClient);

	//curl -X POST -H 'Content-Type: application/json' -d'{"locations":["Le Thah Ton Q3 HCM VN"]}' http://localhost:3001/accounts/savelocation/add/50a1be6e7028797132000001
	app.post('/accounts/driver/savelocation/add/:id', account.addLocationsDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"locations":["Le Thah Ton Q3 HCM VN"]}' http://localhost:3001/accounts/savelocation/add/50a1be6e7028797132000001
	app.post('/accounts/client/savelocation/add/:id', account.addLocationsClient);

	//curl -X POST -H 'Content-Type: application/json' -d'{"locations":["Le Thah Ton Q3 HCM VN"]}' http://localhost:3001/accounts/savelocation/delete/50a1be6e7028797132000001
	app.post('/accounts/driver/savelocation/delete/:id', account.deleteLocationsDriver);
		//curl -X POST -H 'Content-Type: application/json' -d'{"locations":["Le Thah Ton Q3 HCM VN"]}' http://localhost:3001/accounts/savelocation/delete/50a1be6e7028797132000001
	app.post('/accounts/client/savelocation/delete/:id', account.deleteLocationsClient);

	//curl -X POST -H 'Content-Type: application/json' -d'{"deviceToken":"aeace3a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590"}' http://localhost:3001/accounts/adddevicetoken/50a1be6e7028797132000001
	app.post('/accounts/driver/adddevicetoken/:id', account.addDeviceTokenDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"deviceToken":"aeace3a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590"}' http://localhost:3001/accounts/adddevicetoken/50a1be6e7028797132000001
	app.post('/accounts/client/adddevicetoken/:id', account.addDeviceTokenClient);

	//curl -X POST -H 'Content-Type: application/json' -d'{"deviceToken":"aeace3a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590"}' http://localhost:3001/accounts/deletedevicetoken/50a1be6e7028797132000001
	app.post('/accounts/driver/deletedevicetoken/:id', account.deleteDeviceTokenDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"deviceToken":"aeace3a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590"}' http://localhost:3001/accounts/deletedevicetoken/50a1be6e7028797132000001
	app.post('/accounts/client/deletedevicetoken/:id', account.deleteDeviceTokenClient);

	//curl -X POST -H 'Content-Type: application/json' -d'{"deviceToken":"aeace3a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592","oldDeviceToken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b591"}' http://localhost:3001/accounts/updatedevicetoken/50a1be6e7028797132000001
	app.post('/accounts/driver/updatedevicetoken/:id', account.updateDeviceTokenDriver);
	//curl -X POST -H 'Content-Type: application/json' -d'{"deviceToken":"aeace3a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592","oldDeviceToken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b591"}' http://localhost:3001/accounts/updatedevicetoken/50a1be6e7028797132000001
	app.post('/accounts/client/updatedevicetoken/:id', account.updateDeviceTokenClient);


//LOCATION
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [ 106.63896,10.827257 ],"number":"10", "conditions":{"usertype":"Driver"} }' http://localhost:3001/locations/distance
	app.post('/locations/driver/distance', account.findByDistanceDriver);
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [ 106.63896,10.827257 ],"number":"10", "conditions":{"usertype":"Driver"} }' http://localhost:3001/locations/distance
	app.post('/locations/client/distance', account.findByDistanceClient);

	//curl -i -X POST -H 'Content-Type: application/json' -d'{"conditions":{"usertype":"Driver","status":"1"},"num":"10" }' http://localhost:3001/locations/distance/50a1be6e7028797132000001
	app.post('/locations/driver/distance/:id', account.findByDistanceWithAccountIDDriver);
		//curl -i -X POST -H 'Content-Type: application/json' -d'{"conditions":{"usertype":"Driver","status":"1"},"num":"10" }' http://localhost:3001/locations/distance/50a1be6e7028797132000001
	app.post('/locations/client/distance/:id', account.findByDistanceWithAccountIDClient);

// APNS
	//curl -X POST  http://localhost:3001/apn/simplepush
	app.post('/apns/simplepush', apns.simplePush);
	//curl -X POST  -H 'Content-Type: application/json' -d'{"alert" : { "body" : "Bob wants to play poker", "action-loc-key" : "Reject" },"badge":"0"}' http://localhost:3001/apns/requesttaxi/50a1be6e7028797132000001
	app.post('/apns/requesttaxi/:id', apns.pushToRequestTaxi);
	//curl -X POST  -H 'Content-Type: application/json' -d'{"alert" : { "body" : "Bob wants to play poker", "action-loc-key" : "Reject" },"badge":"0"}' http://localhost:3001/apns/respondclient/50a1be6e7028797132000001
	app.post('/apns/respondclient/:id', apns.pushToClient);
	//curl -X POST  -H 'Content-Type: application/json' -d'{"alert" : { "body" : "Bob wants to play poker", "action-loc-key" : "Reject" },"badge":"0"}' http://localhost:3001/apns/arrivalnotify/50a1be6e7028797132000001
	app.post('/apns/arrivalnotify/:id', apns.pushToClient);
	
//app.listen(3001);

app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001, function(){
	//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	console.log('Listening on port 3001...');
});

//app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001);
//console.log('Listening on port 3001...');