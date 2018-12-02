
const mdb = require ('./../../mdb/mdb.js');
const errors = require('./../../schemas/errors/generic.json');
const Ajv = require('ajv');
var ajv = new Ajv();

var userInputSchema = {"type": "object", "required": ["name", "surname", "email", "password"], "properties": {"name": {"type": "string"}, "surname": {"type": "string"}, "email": {"type": "string"}, "password": {"type": "string"}, "type": {"type": "string"}}};

//Functions

function hasEmptyFields(body) {
	let isEmpty = false;
	if (body.name === "" 
		|| body.surname === "" 
		|| body.email === "" 
		|| body.password === "")
	{
			isEmpty = true;
	}
	return isEmpty;
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
		return {"status": 200, "body": users};
	} else {
		return errors.error401;
	}
}

/**
 * /users/:id GET. Gets single user once id specified. If requested user is same of Id, also password is returned
 * This function has a lot of debug comments
 * Had issues with returning a copy of the user, so that the pwd is not modified in the "database"
 * @param {string} token used to verify request coming from logged user
 * @param {number} id id of the user to return
 */
function routerGetUserById(token, id) {
	if (id === null) {
		return errors.error400;
	}
	let requester = mdb.active_users.getUserByToken(token);
	//console.log("REQUESTER ID: " + requester.id);
	//There exist a requester
	if (requester !== null) {
		let retUser = mdb.users.getUserById(id);
		//console.log("SPECIFIED USER ID: " + retUser.id);
		//There exist a returned user
		if (retUser !== undefined) {
			//console.log('................................................................RETUSER: ' + retUser);
			//console.log('REQUESTER: ' + requester);
			let responseUser = JSON.parse(JSON.stringify(retUser));
			//console.log("................................................................COPY OF USER: " + responseUser);
			//If requesting user is not the same he selected, do not include user.password
			//console.log("TEST: " + responseUser.id + "=?=" + requester.id);
			if (responseUser.id !== requester.id) {
				responseUser.password = undefined;
				let temp = mdb.users.getUserById(id);
				//console.log("....................................TEMP OUTPUT-MODIFIED PWD: " + temp.password);
			}
			return {"status": 200, "body": responseUser};
		} else {
			return errors.error404;
		}
	} else {
		return errors.error401;
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
				return errors.error400;
			}
			return {"status": 200, "body": exams};
		} else {
			return errors.error400;
		}
	} else {
		return errors.error401;
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
				return {"status": 200, "body": submissions};
			} else {
				return errors.error401;
			}
		} else {
			return errors.error400;
		}
	} else {
		return errors.error401;
	}
}

/**
 * /users POST. Implements users' subscription
 * @param {object} postBody 
 */
function routerPostUsers(postBody) {
	
	let validate = ajv.compile(userInputSchema);
	
	if (!validate(postBody) || hasEmptyFields(postBody)) {
		return errors.error400;
	} else {
		let name = postBody.name;
		let surname = postBody.surname;
		let email = postBody.email;
		let password = postBody.password;
		let type = postBody.type;
		let result = mdb.users.add(name, surname, email, password, type);
		if (result === -1) {
			return errors.error400;
		} else {
			return {"status": 200, "body": result};
		}
	}
}


module.exports.routerGetUsers = routerGetUsers;
module.exports.routerGetUserById = routerGetUserById;
module.exports.routerGetUsersExams = routerGetUsersExams;
module.exports.routerGetUsersExamSubmissions = routerGetUsersExamSubmissions;
module.exports.routerPostUsers = routerPostUsers;