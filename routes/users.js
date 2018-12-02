
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


/**
 * /users GET. As APIs specify, an array of type [User] w/o pwd fields is returned
 * @param {string} token used to verify request coming from logged user
 */
function routerGetUsers(token) {
	let requester = mdb.active_users.getUserByToken(token);
	//BETTER USER TYPE DEFINITION REQUIRED
	if (requester !== null) {
		let users = mdb.users.filterAll();
		for (let i = 0; i < users.length; i++) {
			users[i].password = undefined;
		}
		return users;
	} else {
		return 'requester not logged or not authorized';
	}
}

/**
 * /users/:id GET. Gets single user once id specified. If requested user is same of Id, also password is returned
 * @param {string} token used to verify request coming from logged user
 * @param {number} id id of the user to return
 */
function routerGetUserById(token, id) {
	let requester = mdb.active_users.getUserByToken(token);
	//console.log("REQUESTER ID: " + requester.id);
	//There exist a requester
	if (requester !== null) {
		let retUser = mdb.users.getUserById(id);
		//console.log("SPECIFIED USER ID: " + retUser.id);
		//There exist a returned user
		if (retUser !== undefined) {
			//console.log('RETUSER: ' + retUser);
			//console.log('REQUESTER: ' + requester);
			//COPY OF USER TO MODIFY PASSWORD FIELD
			let responseUser = JSON.parse(JSON.stringify(retUser));
			//If requesting user is not the same he selected, do not include user.password
			//console.log("TEST: " + responseUser.id + "=?=" + requester.id);
			if (responseUser.id !== requester.id) {
				responseUser.password = undefined;
			}
			return responseUser;
		} else {
			return 'user not found';
		}
	} else {
		return 'requester not logged or not authorized';
	}
}

/**
 * /users/:id/exams GET
 * @param {string} token 
 * @param {number} id id of the user of which to get the exams
 * @param {string} selection tyoe of content to return "created" / "assigned"
 */
function routerGetUsersExams(token, id, selection) {
	let exams = [];
	let requester = mdb.active_users.getUserByToken(token);
	if (requester !== null) {
		let specifiedUser = mdb.users.getUserById(id);
		if (specifiedUser !== undefined) {
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
			return 'Failed to retrieve exams for user with specified id: ' + id;
		}
	} else {
		return 'requester not logged or not authorized';
	}
}


/**
 * /users/:id/exam_submissions GET
 * @param {string} token 
 * @param {number} id 
 */
function routerGetUsersExamSubmissions(token, id) {
	console.log('TOKEN: ' + token);
	let submissions = [];
	let requester = mdb.active_users.getUserByToken(token);
	//console.log("ID PARAMETER: " + id);
	//console.log("REQUESTER ID: " + requester.id);
	if (requester !== null) {
		let specifiedUser = mdb.users.getUserById(id);
		if (specifiedUser !== undefined) {
			//console.log("SPECIFIED USER ID: " + specifiedUser.id);
			if (specifiedUser.id === requester.id) {
				submissions = mdb.exam_submissions.filterBySubmitter(mdb.users.getUserById(id));
				return submissions;
			} else {
				return 'You are authorized to see only your exam submissions';
			}
		} else {
			return 'Failed to retrieve exams for user with specified id: ' + id;
		}
	} else {
		return 'requester not logged or not authorized';
	}
}

/**
 * /users POST. Implements users' subscription
 * @param {object} postBody 
 */
function routerPostUsers(postBody) {
	
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
	//let data = routerGetUsers(mdb.active_users.getTokenByUserId(0));
	let data = routerGetUsers(token);
	res.send(JSON.stringify(data, null, 3));
});

router.post('/', function(req, res) {
	
	let postBody = req.body;

	let result = routerPostUsers(postBody);
	if (result === 1) {
		res.sendStatus(201);
	} else {
		res.send(result + ': user probably already registered, try using another email');
	}
	//Other stati determined automatically I guess
});

router.get('/:user_id', function(req, res) {
	let token = req.query.token;

	//PARSE INT ON STRING PARAMETER
	let id = parseInt(req.params.user_id, 10);
	
	res.setHeader('Content-Type', 'application/json');
	//Test call
	//let data = routerGetUserById(mdb.active_users.getTokenByUserId(0), id);
	let data = routerGetUserById(token, id);
	res.send(JSON.stringify(data, null, 3));
})

router.get('/:user_id/exams', function(req, res) {
	let token = req.query.token;
	let id = parseInt(req.params.user_id, 10);
	let selection = req.query.selection;

	console.log('Selection query: ' + selection);

	res.setHeader('Content-Type', 'application/json');
	//test call
	//let data = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), id, selection);
	let data = routerGetUsersExams(token, id, selection);
	res.send(JSON.stringify(data, null, 3));
})

router.get('/:user_id/exam_submissions', function(req, res) {
	let token = req.query.token;
	let id = parseInt(req.params.user_id, 10);

	res.setHeader('Content-Type', 'application/json');
	//test call
	//let data = routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(2), id);
	let data = routerGetUsersExamSubmissions(token, id)
	res.send(JSON.stringify(data, null, 3));
})


module.exports = router;
module.exports.routerGetUsers = routerGetUsers;
module.exports.routerGetUserById = routerGetUserById;
module.exports.routerGetUsersExams = routerGetUsersExams;
module.exports.routerGetUsersExamSubmissions = routerGetUsersExamSubmissions;
module.exports.routerPostUsers = routerPostUsers;