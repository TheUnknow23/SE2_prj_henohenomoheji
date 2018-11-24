
const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');


//Functions

//Utility function for returning user from req.token

// /users GET. As APIs specify, an array of type [User] w/o pwd fields is returned
function routerGetUsers(token) {
	let requester = mdb.active_users.getUserByToken(token);
	//BETTER USER TYPE DEFINITION REQUIRED
	if (requester !== null && requester.type === 'teacher') {
		let users = mdb.users.getAll();
		for (let i = 0; i < users.length; i++) {
			users[i].password = undefined;
		}
		return users;
	} else {
		return 'requester not logged or not authorized';
	}
}

// /users/:id GET. Gets single user once id specified
function routerGetUserById(token, id) {
	let requester = mdb.active_users.getUserByToken(token);
	if (requester !== null && requester.type === 'teacher') {
		let retUser = mdb.users.getUserById(id);
		if (retUser !== undefined) {
			retUser.password = undefined;
			return retUser;
		} else {
			return 'user not found';
		}
	} else {
		return 'requester not logged or not authorized';
	}
}

// /users/:id/exam_submissions GET
function routerGetUsersExamSubmissions(token, id) {
	let submissions = [];
	let requester = mdb.active_users.getUserByToken(token);
	if (requester !== null) {
		submissions = mdb.exam_submissions.filterBySubmitter(mdb.users.getUserById(id));
		return submissions;
	} else {
		return 'error';
	}
}





//Verbs calls

router.get('/', function(req, res) {
	let token = req.token;
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(routerGetUsers(token), null, 3));
});

router.post('/', function(req, res) {
	let name = req.name;
	let surname = req.surname;
	let email = req.email;
	let password = req.password;
	let type = req.type;

	if (mdb.users.add(name, surname, email, password, type) === 1) {
		res.sendStatus(201);
	}
	//Other stati determined automatically I guess
});

router.get('/:user_id', function(req, res) {
	let token = req.token;
	//PARSE INT ON STRING PARAMETER
	let id = parseInt(req.params.user_id, 10);
	console.log('ID: ' + id);
	//Test call
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(routerGetUserById(mdb.active_users.getTokenByUserId(0), id), null, 3));
})

router.get('/:user_id/exams', function(req, res) {
	let token = req.token;
	let id = parseInt(req.params.user_id, 10);
	res.send('UserId = ' + req.params.user_id);
})

router.get('/:user_id/exam_submissions', function(req, res) {
	let token = req.token;
	let id = parseInt(req.params.user_id, 10);
	//test call
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(0), id), null, 3));
})



module.exports = router;