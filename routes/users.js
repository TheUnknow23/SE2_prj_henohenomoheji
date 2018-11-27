
const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');
const ajvClass = require('ajv');
const ajv = new ajvClass();

var userInputSchema = {"type": "object", "required": ["name", "surname", "email", "password"], "properties": {"name": {"type": "string"}, "surname": {"type": "string"}, "email": {"type": "string"}, "password": {"type": "string"}, "type": {"type": "string"}}};

//Functions

function hasEmptyFields(body) {
	let empty = false;
	if (body.name === "" 
		|| body.surname === "" 
		|| body.email === "" 
		|| body.password === "")
	{
			empty = true;
	}
	return empty;
}

// /users GET. As APIs specify, an array of type [User] w/o pwd fields is returned
function routerGetUsers(token) {
	let requester = mdb.active_users.getUserByToken(token);
	//BETTER USER TYPE DEFINITION REQUIRED
	if (requester !== null) {
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
	//There exist a requester
	if (requester !== null) {
		let retUser = mdb.users.getUserById(id);
		//There exist a returned user
		if (retUser !== undefined) {
			//If requesting user is not the same he selected, do not include user.password
			if (retUser.id !== requester.id) {
				retUser.password = undefined;
			}
			return retUser;
		} else {
			return 'user not found';
		}
	} else {
		return 'requester not logged or not authorized';
	}
}

// /users/:id/exams GET
function routerGetUsersExams(token, id, selection) {
	let exams = [];
	let requester = mdb.active_users.getUserByToken(token);
	if (requester !== null) {
		if (selection == 'created') {
			exams = mdb.exams.filterByOwner(mdb.users.getUserById(id));
		} else if (selection == 'assigned') {
			exams = mdb.exams.filterByAssignedId(id);
			//If assigned exams, delete task results in each taskset for
		} else {
			return 'Error in reading <selection> parameter'
		}
		return exams;
	} else {
		return 'error';
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
		return 'requester not logged or not authorized';
	}
}

// /users POST
function routerPostUser(postBody) {
	
	let validate = ajv.compile(userInputSchema);
	
	if (!validate(postBody) || hasEmptyFields(postBody)) {
		return '400 Invalid post input'
	} else {
		let name = postBody.name;
		let surname = postBody.surname;
		let email = postBody.email;
		let password = postBody.password;
		let type = postBody.type;

		return mdb.users.add(name, surname, email, password, type);
	}
}



//Verbs calls

router.get('/', function(req, res) {
	let token = req.query.token; //Token already string

	res.setHeader('Content-Type', 'application/json');
	//Test call
	let data = routerGetUsers(mdb.active_users.getTokenByUserId(0));
	//let data = routerGetUsers(token);
	res.send(JSON.stringify(data, null, 3));
});

router.post('/', function(req, res) {
	
	let postBody = req.body;
	console.log("NAME: " + postBody.name);
	
	if (routerPostUser(postBody) === 1) {
		res.sendStatus(201);
	}
	//Other stati determined automatically I guess
});

router.get('/:user_id', function(req, res) {
	let token = req.query.token;

	//PARSE INT ON STRING PARAMETER
	let id = parseInt(req.params.user_id, 10);
	console.log('ID: ' + id);
	
	res.setHeader('Content-Type', 'application/json');
	//Test call
	let data = routerGetUserById(mdb.active_users.getTokenByUserId(0), id);
	//let data = routerGetUserById(token, id);
	res.send(JSON.stringify(data, null, 3));
})

router.get('/:user_id/exams', function(req, res) {
	let token = req.query.token;
	let id = parseInt(req.params.user_id, 10);
	let selection = req.query.selection;

	console.log('Selection query: ' + selection);

	res.setHeader('Content-Type', 'application/json');
	//test call
	let data = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), id, selection);
	//let data = routerGetUsersExams(token, id, selection);
	res.send(JSON.stringify(data, null, 3));
})

router.get('/:user_id/exam_submissions', function(req, res) {
	let token = req.token;
	let id = parseInt(req.params.user_id, 10);

	res.setHeader('Content-Type', 'application/json');
	//test call
	let data = routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(0), id);
	//let data = routerGetUsersExamSubmissions(token, id)
	res.send(JSON.stringify(routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(0), id), null, 3));
})


module.exports = router;