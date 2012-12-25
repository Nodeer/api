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

exports.requestDrivers = function(req, res) {

	var id = req.params.id;
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
			// send notification to desired drivers
			pushContents = {};
			tokens = o;
			apns.push_Drivers(pushContents,tokens,function(e, o) {
                if (e) {
                    retdata.msg = e;
					res.send(retdata, 400);
                } else {
					var usertype = 0;
					var Status = 2;
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
