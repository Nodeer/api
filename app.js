var express = require('express'),
    account = require('./routes/account');

//var app = express.createServer();
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

// USER
	//http://taxivnapi.rs.af.cm/accounts/signup
	app.put('/accounts/signup', account.signUp);
	//http://taxivnapi.rs.af.cm/accounts/login
	app.get('/accounts/login', account.login);
	//http://taxivnapi.rs.af.cm/accounts/
	app.get('/accounts', account.findAll);
	//http://taxivnapi.rs.af.cm/accounts/50a1be6e7028797132000001
	app.get('/accounts/:id', account.findById);
	////http://taxivnapi.rs.af.cm/accounts/type/Driver
	app.get('/accounts/type/:type', account.findByType);
	//curl -i -X PUT -H 'Content-Type: application/json' -d'{"loc" : [106.638966,10.827257] }' http://taxivnapi.rs.af.cm/accounts/location/50a1be6e7028797132000001
	app.put('/accounts/location/:id', account.updateLocation);
	//curl -i -X PUT -H 'Content-Type: application/json' -d'{"status":"1"}' http://localhost:3001/accounts/status/50a1be6e7028797132000001
	app.put('/accounts/status/:id', account.updateStatus);

//LOCATION
	//curl -i -X GET -H 'Content-Type: application/json' -d'{"loc" : [ 106.63896,10.827257 ],"number":"10", "conditions":{"usertype":"Driver"} }' http://localhost:3001/locations/distance
	app.get('/locations/distance', account.findByDistance3);
	//curl -i -X GET -H 'Content-Type: application/json' -d'{"number":"10","conitions":{"usertype":"Driver","status":"1"}}' http://localhost:3001/locations/distance/50a1be6e7028797132000001
	app.get('/locations/distance/:id', account.findByDistanceWithAccountID2);

//app.listen(3001);

app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001, function(){
	//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	console.log('Listening on port 3001...');
});

//app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001);
//console.log('Listening on port 3001...');