//var express = require('express'),
    //account = require('./routes/account');
var    AM = require('../modules/accountModule');
var    aigoDefine = require('../configs/define');
//var app = express.createServer();


//~/Working/aigo/api/routes/modules/accountModule.js

// exports.signUp = function(req, res) 
// {
// 	var retdata = {};
// 	console.log('user: ' + req.body.user);
// 	AM.signup(req.body, function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// };

exports.signUpDriver = function(req, res) 
{
	var retdata = {};
	console.log('user: ' + req.body.user);
	AM.signup(req.body,1,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

exports.signUpClient = function(req, res) 
{
	var retdata = {};
	console.log('user: ' + req.body.user);
	AM.signup(req.body,0, function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};


exports.deleteDriver = function(req, res) 
{

	var id = req.params.id;
	var retdata = {};
	console.log('delete driver: ' + id);
	AM.delete(id,1,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			//retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

exports.deleteClient = function(req, res) 
{
	var id = req.params.id;
	var retdata = {};
	console.log('delete client: ' + id);
	AM.delete(id,0, function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			//retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

// exports.login = function(req, res) 
// {
// 	console.log('login: ' + req.body.user);
// 	var retdata = {};
// 	AM.manualLogin(req.body.user, req.body.pass,function(e, o) {
// 		if (!o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
			
// 			// update status online
// 			var id = o._id.toHexString();
// 			//id = '50a1be6e7028797132000001';
// 			console.log('login: ' + id);
// 			var Status = 1;
// 			AM.updateStatus(id,Status,function(e, o) {
// 				if (e) {
// 					retdata.msg = e;
// 					res.send(retdata, 400);
// 				}	else {
// 					//retdata = o;
// 					retdata.status = Status;
// 					retdata.msg = 'ok';
// 					res.send(retdata, 200);
// 				}
// 			});	
// 		}
// 	});	
// };

// exports.loginWithDeviceToken = function(req, res) 
// {
// 	console.log('login: ' + req.body.user);
// 	var retdata = {};
// 	AM.manualLoginWithType(req.body.user, req.body.pass, req.body.usertype, function(e, o) {
// 		if (!o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
			
// 			// update status online
// 			var id = o._id.toHexString();
// 			//id = '50a1be6e7028797132000001';
// 			console.log('login: ' + id);
// 			var Status = 1;
// 			AM.updateStatus(id,Status,function(e, o) {
// 				if (e) {
// 					retdata.msg = e;
// 					res.send(retdata, 400);
// 				}	else {
// 					//retdata = o;
// 					retdata.status = Status;
// 					retdata.msg = 'ok';
// 					var deviceToken = req.body.devicetoken;
// 					AM.addDeviceToken(id,deviceToken,function(e, o) {
// 						if (e || !o) {
// 							retdata.msg = e;
// 							res.send(retdata, 400);
// 						}	else {
// 							//retdata = o;
// 							//retdata.msg = 'ok';
// 							res.send(retdata, 200);
// 						}
// 					});	
// 				}
// 			});	
// 		}
// 	});	
// };

exports.loginWithDeviceTokenDriver = function(req, res) 
{
	console.log('login: ' + req.body.user);
	var retdata = {};
	var usertype = 1;
	AM.manualLogin(req.body.user, req.body.pass, usertype, function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			
			// update status online
			var id = o._id.toHexString();
			//id = '50a1be6e7028797132000001';
			console.log('login: ' + id);
			var Status = aigoDefine.status['online'];
			AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					//retdata = o;
					retdata.status = Status;
					retdata.msg = 'ok';
					var deviceToken = req.body.devicetoken;
					AM.addDeviceToken(id,deviceToken,usertype,function(e, o) {
						if (e || !o) {
							retdata.msg = e;
							res.send(retdata, 400);
						}	else {
							//retdata = o;
							//retdata.msg = 'ok';
							res.send(retdata, 200);
						}
					});	
				}
			});	
		}
	});	
};

exports.loginWithDeviceTokenClient= function(req, res) 
{
	console.log('login: ' + req.body.user);
	var retdata = {};
	var usertype = 0;
	AM.manualLogin(req.body.user, req.body.pass, usertype, function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			
			// update status online
			var id = o._id.toHexString();
			//id = '50a1be6e7028797132000001';
			console.log('login: ' + id);
			var Status = aigoDefine.status['online'];
			AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					//retdata = o;
					retdata.status = Status;
					retdata.msg = 'ok';
					var deviceToken = req.body.devicetoken;
					AM.addDeviceToken(id,deviceToken,usertype,function(e, o) {
						if (e || !o) {
							retdata.msg = e;
							res.send(retdata, 400);
						}	else {
							//retdata = o;
							//retdata.msg = 'ok';
							res.send(retdata, 200);
						}
					});	
				}
			});	
		}
	});	
};

// exports.logout = function(req, res) 
// {
// 	var id = req.params.id;
//     var Status = 0;
//     console.log('Logout: ' + id); 
    
//     var retdata = {};
// 	AM.updateStatus(id,Status,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// };

// exports.logoutWithDeviceToken = function(req, res) 
// {
// 	var id = req.params.id;
//     var Status = 0;
//     console.log('Logout: ' + id); 
    
//     var retdata = {};
// 	AM.updateStatus(id,Status,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			var deviceToken = req.body.devicetoken;
// 			AM.deleteDeviceToken(id,deviceToken,function(e, o) {
// 				if (e || !o) {
// 					retdata.msg = e;
// 					res.send(retdata, 400);
// 				}	else {
// 					retdata = o;
// 					retdata.msg = 'ok';
// 					res.send(retdata, 200);
// 				}
// 			});	
// 			//res.send(retdata, 200);
// 		}
// 	});	
// };


exports.logoutWithDeviceTokenDriver = function(req, res) 
{
	var id = req.params.id;
    var Status = "0";
    console.log('Logout: ' + id); 
    
    var retdata = {};
    var usertype = 1;
	AM.updateStatus(id,Status,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			var deviceToken = req.body.devicetoken;
			AM.deleteDeviceToken(id,deviceToken,usertype,function(e, o) {
				if (e || !o) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					retdata = o;
					retdata.msg = 'ok';
					res.send(retdata, 200);
				}
			});	
			//res.send(retdata, 200);
		}
	});	
};



exports.logoutWithDeviceTokenClient = function(req, res) 
{
	var id = req.params.id;
    var Status = "0";
    console.log('Logout: ' + id); 
    
    var retdata = {};
     var usertype = 0;
	AM.updateStatus(id,Status,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			var deviceToken = req.body.devicetoken;
			AM.deleteDeviceToken(id,deviceToken,usertype,function(e, o) {
				if (e || !o) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					retdata = o;
					retdata.msg = 'ok';
					res.send(retdata, 200);
				}
			});	
			//res.send(retdata, 200);
		}
	});	
};


// Find all user
// exports.findAll = function(req, res)
// {
// 	var retdata = {};
// 	AM.getAllRecords(function(e, o) {
// 		if (!o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// };

// Find all user
exports.findAllDriver = function(req, res)
{
	var retdata = {};
	AM.getAllRecords(1,function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

// Find all user
exports.findAllClient = function(req, res)
{
	var retdata = {};
	AM.getAllRecords(0,function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};
// Find a user by id
// Input:
//     	- id: User ID
exports.findById = function(req, res) {
    var id = req.params.id;
    
    var retdata = {};
	AM.findById(id,function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

// Find a driver by id
// Input:
//     	- id: User ID
exports.findByIdDriver = function(req, res) {
    var id = req.params.id;
    
    var retdata = {};
    var usertype = 1;
	AM.findById(id, usertype,function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};


// Find a user by id
// Input:
//     	- id: User ID
exports.findByIdClient = function(req, res) {
    var id = req.params.id;
    
    var retdata = {};
    var usertype = 0;
	AM.findById(id, usertype, function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};


// Update user rating
// Input:
//     	- id: user ID (in URL)
//     	- like: 0 - 1
// exports.rating = function(req, res) {
// 	var id = req.params.id;
//     var like = req.body.like;
//     console.log(JSON.stringify(like));
    
//     var retdata = {};
// 	AM.rating(id,like,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Update driver rating
// Input:
//     	- id: user ID (in URL)
//     	- like: 0 - 1
exports.ratingDriver = function(req, res) {
	var id = req.params.id;
    var like = req.body.like;
    console.log(JSON.stringify(like));
    
    var retdata = {};
    var usertype = 1;
	AM.rating(id,like,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update user rating
// Input:
//     	- id: user ID (in URL)
//     	- like: 0 - 1
exports.ratingClient = function(req, res) {
	var id = req.params.id;
    var like = req.body.like;
    console.log(JSON.stringify(like));
    
    var retdata = {};
    var usertype = 0;
	AM.rating(id,like,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update user info
// Input:
//     	- User info in json
// exports.updateInfo = function(req, res) {
//     var info = req.body;
//     console.log(JSON.stringify(info));
    
//     var retdata = {};
// 	AM.freeUpdate(info,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Update driver info
// Input:
//     	- User info in json
exports.updateInfoDriver = function(req, res) {
    var info = req.body;
    console.log(JSON.stringify(info));
    
    var retdata = {};
    var usertype = 1;
	AM.freeUpdate(info,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update user info
// Input:
//     	- User info in json
exports.updateInfoClient = function(req, res) {
    var info = req.body;
    console.log(JSON.stringify(info));
    
    var retdata = {};
    var usertype = 0;
	AM.freeUpdate(info,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update user location
// Input:
//     	- id: user ID (in URL)
//     	- location: {[lon,lat]}
// exports.updateLocation = function(req, res) {
//     var id = req.params.id;
//     var Location = req.body;
//     console.log('Updating Location for userID: ' + id); 
//     console.log(JSON.stringify(Location));
    
//     var retdata = {};
// 	AM.updateLocation(id,Location,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Update user location
// Input:
//     	- id: user ID (in URL)
//     	- location: {[lon,lat]}
exports.updateLocationDriver = function(req, res) {
    var id = req.params.id;
    var Location = req.body;
    console.log('Updating Location for userID: ' + id); 
    console.log(JSON.stringify(Location));

    var retdata = {};
    var usertype = 1;
	AM.updateLocation(id,Location,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update user location
// Input:
//     	- id: user ID (in URL)
//     	- location: {[lon,lat]}
exports.updateLocationClient = function(req, res) {
    var id = req.params.id;
    var Location = req.body;
    console.log('Updating Location for userID: ' + id); 
    console.log(JSON.stringify(Location));
    
    var retdata = {};
    var usertype = 0;
	AM.updateLocation(id,Location,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update user status
// Input:
//     	- id: user ID (in URL)
//     	- status: 0-offline, 1-online, 2-busy, 3-serving.
// exports.updateStatus = function(req, res) {
//     var id = req.params.id;
//     var Status = req.body.status;
//     console.log('Updating Status: ' + id); 
    
//     var retdata = {};
// 	AM.updateStatus(id,Status,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }


// Update driver status
// Input:
//     	- id: user ID (in URL)
//     	- status: 0-offline, 1-online, 2-busy, 3-serving.
exports.updateStatusDriver = function(req, res) {
    var id = req.params.id;
    var Status = req.body.status;
    console.log('Updating Status: ' + id); 
    
    var retdata = {};
    var usertype = 1;
	AM.updateStatus(id,Status,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}


// Update user status
// Input:
//     	- id: user ID (in URL)
//     	- status: 0-offline, 1-online, 2-busy, 3-serving.
exports.updateStatusClient = function(req, res) {
    var id = req.params.id;
    var Status = req.body.status;
    console.log('Updating Status: ' + id); 
    
    var retdata = {};
    var usertype = 0;
	AM.updateStatus(id,Status,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}


// Add device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
// exports.addDeviceToken = function(req, res) {
//     var id = req.params.id;
//     var deviceToken = req.body.deviceToken;
//     console.log('Add device token: ' + id); 
    
//     var retdata = {};
// 	AM.addDeviceToken(id,deviceToken,function(e, o) {
// 		if (e || !o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Add device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.addDeviceTokenDriver = function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.devicetoken;
    console.log('Add device token: ' + id); 
    
    var retdata = {};
    var usertype = 1;
	AM.addDeviceToken(id,deviceToken,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Add device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.addDeviceTokenClient = function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.devictoken;
    console.log('Add device token: ' + id); 
    
    var retdata = {};
    var usertype = 0;
	AM.addDeviceToken(id,deviceToken,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Delete device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
// exports.deleteDeviceToken = function(req, res) {
//     var id = req.params.id;
//     var deviceToken = req.body.deviceToken;
//     console.log('Delete device token: ' + id); 
    
//     var retdata = {};
// 	AM.deleteDeviceToken(id,deviceToken,function(e, o) {
// 		if (e || !o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Delete device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.deleteDeviceTokenDriver = function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.devicetoken;
    console.log('Delete device token: ' + id); 
    
    var retdata = {};
    var usertype = 1;
	AM.deleteDeviceToken(id,deviceToken,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Delete device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.deleteDeviceTokenClient = function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.devicetoken;
    console.log('Delete device token: ' + id); 
    
    var retdata = {};
    var usertype = 0;
	AM.deleteDeviceToken(id,deviceToken,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Update device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
// exports.updateDeviceToken = function(req, res) {
//     var id = req.params.id;
//     var deviceToken = req.body.deviceToken;
//     var olddeviceToken = req.body.oldDeviceToken;
//     console.log('Delete device token: ' + id); 
    
//     var retdata = {};
// 	AM.updateDeviceToken(id,deviceToken,olddeviceToken,function(e, o) {
// 		if (e || !o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }


// Update device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.updateDeviceTokenDriver = function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.devicetoken;
    var olddeviceToken = req.body.olddeviceroken;
    console.log('Driver Update device token: ' + id + "new:" + deviceToken + "old:" + olddeviceToken); 
    
    var retdata = {};
    var usertype = 1;
	AM.updateDeviceToken(id,olddeviceToken,deviceToken,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}


// Update device token
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.updateDeviceTokenClient = function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.devicetoken;
    var olddeviceToken = req.body.olddevicetoken;
    console.log('Clietn Update device token: ' + id + "new:" + deviceToken + "old:" + olddeviceToken); 
    
    var retdata = {};
    var usertype = 0;
	AM.updateDeviceToken(id,deviceToken,olddeviceToken,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}


// Add locations 
// Input:
//     	- id: user ID (in URL)
//     	- array locations
// exports.addLocations = function(req, res) {
//     var id = req.params.id;
//     var locations = req.body.locations;
//     console.log('Add locations: ' + id); 
    
//     var retdata = {};
// 	AM.addLocations(id,locations,function(e, o) {
// 		if (e || !o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }


// Add locations 
// Input:
//     	- id: user ID (in URL)
//     	- array locations
exports.addLocationsDriver = function(req, res) {
    var id = req.params.id;
    var locations = req.body.locations;
    console.log('Add locations: ' + id); 
    
    var retdata = {};
    var usertype = 1;
	AM.addLocations(id,locations,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}


// Add locations 
// Input:
//     	- id: user ID (in URL)
//     	- array locations
exports.addLocationsClient = function(req, res) {
    var id = req.params.id;
    var locations = req.body.locations;
    console.log('Add locations: ' + id); 
    
    var retdata = {};
    var usertype = 0;
	AM.addLocations(id,locations,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Delete location
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
// exports.deleteLocations = function(req, res) {
//     var id = req.params.id;
//     var locations = req.body.locations;
//     console.log('Delete locations: ' + id); 
    
//     var retdata = {};
// 	AM.deleteLocations(id,locations,function(e, o) {
// 		if (e || !o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Delete location
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.deleteLocationsDriver = function(req, res) {
    var id = req.params.id;
    var locations = req.body.locations;
    console.log('Delete locations: ' + id); 
    
    var retdata = {};
    var usertype = 1;
	AM.deleteLocations(id,locations,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Delete location
// Input:
//     	- id: user ID (in URL)
//     	- device token for APNS
exports.deleteLocationsClient = function(req, res) {
    var id = req.params.id;
    var locations = req.body.locations;
    console.log('Delete locations: ' + id); 
    
    var retdata = {};
    var usertype = 0;
	AM.deleteLocations(id,locations,usertype,function(e, o) {
		if (e || !o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Find the closed Users: return without distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
// exports.findByDistance = function(req, res) {

// 	var Location = req.body.loc;
//     var number = req.body.number;
//     var conditions = req.body.conditions;
    
//     console.log('- Location: ' + Location);
//     console.log('- number: ' + number);
//     console.log('- conditions: ' + conditions);
    
//     var retdata = {};
// 	AM.findByDistance(req.body.loc,number,conditions,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Find the closed Driver: return without distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistanceDriver = function(req, res) {

	var Location = req.body.loc;
    var number = req.body.number;
    //var conditions = req.body.conditions;
    var conditions = {"status":aigoDefine.status['online']};
    
    console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 1;
	AM.findByDistance(req.body.loc,number,conditions,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Find the closed Driver: return without distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistanceClient = function(req, res) {

	var Location = req.body.loc;
    var number = req.body.number;
    var seat = req.body.seat;
    var conditions = {
    	"status":aigoDefine.status['online']
    };
    if (seat != "0") {
    	conditions = {
    		"status":aigoDefine.status['online'],
    		"seat":seat
    	};
    }	
    
    console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 0;
	AM.findByDistance(req.body.loc,number,conditions,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = o;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
}

// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
// exports.findByDistanceWithAccountID = function(req, res) {
//     var id = req.params.id;
//     var conditions = req.body.conditions;
//     var number = req.body.number;
    
//     console.log('Retrieving accounts by distance: ' + req.body.loc);
    
//     var retdata = {};
    
// 	AM.findById(id,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			AM.findByDistance(o.loc,number,conditions,function(e, o) {
// 				if (e) {
// 					retdata.msg = e;
// 					res.send(retdata, 400);
// 				}	else {
// 					retdata = o;
// 					retdata.msg = 'ok';
// 					res.send(retdata, 200);
// 				}
// 			});	
// 		}
// 	});	
	
// }

// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistanceWithAccountIDDriver = function(req, res) {
    var id = req.params.id;
    //var conditions = req.body.conditions;
    var number = req.body.number;
    var conditions = {"status":aigoDefine.status['online']};

    console.log('Retrieving accounts by distance: ' + req.body.loc);
    
    var retdata = {};
    var usertype = 1;
    var maxDistance = 10/3963;
	AM.findById(id,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			AM.findByDistance(o.loc,number,conditions,usertype,maxDistance,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					retdata = o;
					retdata.msg = 'ok';
					res.send(retdata, 200);
				}
			});	
		}
	});	
	
}


// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistanceWithAccountIDClient = function(req, res) {
    var id = req.params.id;
    //var conditions = req.body.conditions;
    var number = req.body.number;
    var seat = req.body.seat;
    var conditions = {
    	"status":aigoDefine.status['online']
    };
    if (seat != "0") {
    	conditions = {
    		"status":aigoDefine.status['online'],
    		"seat":seat
    	};
    }
    
    //console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + JSON.stringify(conditions));

    //console.log('Retrieving accounts by distance: ' + req.body.loc);
    
    var retdata = {};
    var usertype = 0;
    var maxDistance = 10/3963;
	AM.findById(id,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			AM.findByDistance(o.loc,number,conditions,usertype,maxDistance,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					retdata = o;
					retdata.msg = 'ok';
					res.send(retdata, 200);
				}
			});	
		}
	});	
	
}