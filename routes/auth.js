
const express = require('express');
const router = express.Router();
const logic = require('./logic/auth_logic.js');

router.post('/', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;
	res.send(logic.loginFunction(email, password));
});

module.exports = router;
