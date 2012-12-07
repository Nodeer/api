var express = require('express'),
    //account = require('./routes/account');
    account = require('./routes/controllers/accountController');

var app = express.createServer();
//var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(require('connect').bodyParser());
});

// USER
	//http://taxivnapi.rs.af.cm/accounts/signup
	app.post('/accounts/signup', account.signUp);
	//curl -X POST -H 'Content-Type: application/json' -d'{"user":"trong", "pa":"123456"}' http://localhost:3001/accounts/login
	app.post('/accounts/login', account.login);
	//curl -X POST  http://localhost:3001/accounts/logout/50a1be6e7028797132000001
	app.post('/accounts/logout/:id', account.logout);
	//http://taxivnapi.rs.af.cm/accounts/
	app.get('/accounts', account.findAll);
	//http://taxivnapi.rs.af.cm/accounts/50a1be6e7028797132000001
	app.get('/accounts/:id', account.findById);
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [106.638966,10.827257] }' http://taxivnapi.rs.af.cm/accounts/location/50a1be6e7028797132000001
	app.post('/accounts/location/:id', account.updateLocation);
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"status":"1"}' http://localhost:3001/accounts/status/50a1be6e7028797132000001
	app.post('/accounts/status/:id', account.updateStatus);

//LOCATION
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [ 106.63896,10.827257 ],"number":"10", "conditions":{"usertype":"Driver"} }' http://localhost:3001/locations/distance
	app.post('/locations/distance', account.findByDistance);
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"conditions":{"usertype":"Driver","status":"1"},"num":"10" }' http://localhost:3001/locations/distance/50a1be6e7028797132000001
	app.post('/locations/distance/:id', account.findByDistanceWithAccountID);

//app.listen(3001);

app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001, function(){
	//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	console.log('Listening on port 3001...');
});

//app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001);
//console.log('Listening on port 3001...');