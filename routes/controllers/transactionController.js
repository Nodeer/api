//var express = require('express'),
    //account = require('./routes/account');
var    AM = require('../modules/accountModule');
var    apns = require('../modules/apnModule');

// Find the closed Driver: return without distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.listTokensbyFindByDistance = function(req, res) {

	var Location = req.body.loc;
    var number = req.body.number;
    var conditions = req.body.conditions;
    
    console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 0;
	AM.listTokensbyFindByDistance(req.body.loc,number,conditions,usertype,function(e, o) {
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

// Client request Drivers
exports.requestDrivers = function(req, res) {

	var id = req.params.id;
	var Location = req.body.loc;
    //var number = req.body.number;
    //var conditions = req.body.conditions;
    
    var number = 10;
  	var conditions = {"status":"1"};
    
    console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 0;
	AM.listTokensbyFindByDistance(req.body.loc,number,conditions,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			// send notification to desired drivers
			var pushContents = {};
			pushContents.alert = "Client request pick up";
			pushContents.payload = {"clientID":id};
			tokens = o;
			apns.push_Drivers(pushContents,tokens,function(e, o) {
                if (e) {
                    retdata.msg = e;
					res.send(retdata, 400);
                } else {
					var usertype = 0;
					var Status = "2";
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
            });	
		}
	});	
}

// Client cancel request
exports.cancelRequestClient = function(req, res) {

	var id = req.params.id;
	//var Location = req.body.loc;
    //var number = req.body.number;
    //var conditions = req.body.conditions;
    
    var number = 10;
  	var conditions = {"status":"1"};
    
    // console.log('- Location: ' + Location);
    // console.log('- number: ' + number);
    // console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 0;
    var Status = "1";
    AM.findById(id,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == "2") {
			var Status = "1";
			o.status = Status;
			o.transaction = "";
			AM.saveData(o,usertype,function(e, o) {
				if (e) {
	                retdata.msg = e;
					res.send(retdata, 400);
				} else {
					retdata = o;
					retdata.msg = 'ok';
					res.send(retdata, 200);
				}
			});
		} else {
			retdata.msg = "Can not cancel request";
			res.send(retdata, 400);
		}
	});
}

// Client Transaction request
exports.cancelTransactionClient = function(req, res) {
	var clientID = req.params.id;
	var driverID = req.body.driverid;
  
    var retdata = {};
    var usertype = 1;
	AM.findById(driverID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == "3") {
			var Status = "1";
			o.status = Status;
			o.transaction = "";
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Client cancel transaction";
					pushContents.payload = {"clientID":clientID};
					tokens = o.devices.iOS;
					apns.push_Drivers(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Client
			            	var usertype = 0;
							AM.findById(clientID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = "1";
									o.status = Status;
									o.transaction = "";
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Driver is not available.";
			res.send(retdata, 400);
		}
	});	
}

// Driver cancel transaction
exports.cancelTransactionDriver = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
  
    var retdata = {};
    var usertype = 0;
	AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == "3") {
			var Status = "1";
			o.status = Status;
			o.transaction = "";
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Driver cancel transaction";
					pushContents.payload = {"driverID":driverID};
					tokens = o.devices.iOS;
					apns.push_Clients(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Driver
			            	var usertype = 1;
							AM.findById(driverID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = "1";
									o.status = Status;
									o.transaction = "";
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Client is not available.";
			res.send(retdata, 400);
		}
	});	
}

// Driver accept request from client:
//   1) Send notification to client
//   2) Update status of driver = 3
//	 3) update status of driver = 3
//   4) Add driver_ID to transaction of Client
exports.acceptRequestDriver = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
    //var number = req.body.number;
    //var conditions = req.body.conditions;
  
    var retdata = {};
    var usertype = 0;
	AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == "2") {
			var Status = "3";
			o.status = Status;
			o.transaction = driverID;
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Driver accept transaction";
					pushContents.payload = {"driverID":driverID};
					tokens = o.devices.iOS;
					apns.push_Clients(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Driver
			            	var usertype = 1;
							AM.findById(driverID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = "3";
									o.status = Status;
									o.transaction = clientID;
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Client is not available. Other driver picked up";
			res.send(retdata, 400);
		}
	});	
}
