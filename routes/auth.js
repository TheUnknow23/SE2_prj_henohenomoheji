
const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

function loginFunction(email, password) {
	let reqUser = mdb.users.getUserByEmail(email);
	//If user is registered
	if (reqUser !== null) {
		if (password === reqUser.password) {
			//console.log('REQUSER: ' + reqUser);
			let sessionToken = mdb.active_users.add(reqUser);
			if (sessionToken !== undefined) {
				//console.log(sessionToken);
				return sessionToken.toString();
			} else {
				return 'some error occurred';
			}
		}
	} else {
		return 'login failed';
	}
}

router.post('/', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;
	res.send(loginFunction(email, password));
});

module.exports = router;
module.exports.loginFunction = loginFunction;
