
const mdb = require('../mdb/mdb.js');

const routerGetUsers = require('../routes/users.js').routerGetUsers;
const routerPostUsers = require('../routes/users.js').routerPostUsers;
const routerGetUserById = require('../routes/users.js').routerGetUserById;
const routerGetUsersExams = require('../routes/users.js').routerGetUsersExams;
const routerGetUsersExamSubmissions = require('../routes/users.js').routerGetUsersExamSubmissions;



// GET /users

test('GET /users OK case with requester valid', () => {
    let users = routerGetUsers(mdb.active_users.getTokenByUserId(0));
    for (let i = 0; i < users.length; i++) {
        expect(users[i]).toBeDefined();
        expect(users[i].password).toBeUndefined()
    }
});

test('GET /users NOT OK case with requester null / invalid token', () => {
    let users = routerGetUsers('bananana');
    expect(users).toBe('requester not logged or not authorized');
});

test('GET /users NOT OK case with void arguments', () => {
    let users = routerGetUsers();
    expect(users).toBe('requester not logged or not authorized');
});



// POST /users

test('POST /users OK case ', () => {
    let result = routerPostUsers( {"name": "a", "surname": "b", "email": "c@d.e", "password": "fgh", "type": "banana" } );
    expect(result).toBe(mdb.users.getUserByEmail('c@d.e').id);
});

test('POST /users OK case without "type" parameter', () => {
    let result = routerPostUsers( {"name": "a", "surname": "b", "email": "ba@na.na", "password": "fgh", "type": ""} );
    expect(result).toBe((mdb.users.getUserByEmail('ba@na.na').id));
});

test('POST /users NOT OK case invalid payload (one required parameter missing)', () => {
    let result = routerPostUsers( {"surname": "b", "email": "c@d.e", "password": "fgh", "type": "banana" } );
    expect(result).toBe('400 Invalid post input');
});

test('POST /users NOT OK case invalid payload (one required paramete rempty)', () => {
    let result = routerPostUsers( {"name": "a", "surname": "", "email": "zzzz@z.z", "password": "fgh", "type": "banana" } );
    expect(result).toBe('400 Invalid post input');
});

test('POST /users NOT OK case user already subscribed (same email)', () => {
    let result = routerPostUsers( {"name": "a", "surname": "b", "email": "gino@gino", "password": "fgh", "type": "banana" } );
    expect(result).toBe(-1);
});



// GET /users/:id

test('GET /users/:id OK case with requester != requested', () => {
    let user = routerGetUserById(mdb.active_users.getTokenByUserId(0), 1);
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.surname).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password).toBeUndefined();
});

test('GET /users/:id OK case with requester == requested', () => {
    let user = routerGetUserById(mdb.active_users.getTokenByUserId(0), 0);
    console.log('..............................................................................TOKEN: ' + mdb.active_users.getTokenByUserId(0));
    console.log('..............................................................................USER: ' + user);
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.surname).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password).toBeDefined();
});

test('GET /users/:id NOT OK case with requester not logged', () => {
    let user = routerGetUserById(mdb.active_users.getTokenByUserId(1231), 0);
    expect(user).toBe('requester not logged or not authorized');
});

test('GET /users/:id NOT OK case with token invalid', () => {
    let user = routerGetUserById('xA67F2r2', 1);
    //Will be changed because of return error
    expect(user).toBe('requester not logged or not authorized');
});

test('GET /users/:id NOT OK case with id invalid', () => {
    let user = routerGetUserById(mdb.active_users.getTokenByUserId(0), 342);
    //Will be changed because of return error
    expect(user).toBe('user not found');
});

test('GET /users/:id NOT OK case with id null', () => {
    let user = routerGetUserById(mdb.active_users.getTokenByUserId(0), null);
    //Will be changed because of return error
    expect(user).toBe('user not found');
});

test('GET /users/:id NOT OK case with token null', () => {
    let user = routerGetUserById(null, 1);
    //Will be changed because of return error
    expect(user).toBe('requester not logged or not authorized');
});



// GET /users/:id/exams

test('GET /users/:id/exams OK case with selection=created', () => {
    let result = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), 0, 'created');
    for (let i = 0; i < result.length; i++) {
        expect(result[i].id).toBeDefined();
        expect(result[i].owner).toBeDefined();
        expect(result[i].title).toBeDefined();
        expect(result[i].subject).toBeDefined();
        expect(result[i].description).toBeDefined();
        expect(result[i].taskset).toBeDefined();
        expect(result[i].group).toBeDefined();
        expect(result[i].final_deadline).toBeDefined();
        expect(result[i].review_deadline).toBeDefined();
    }
});

test('GET /users/:id/exams OK case with selection=assigned', () => {
    let result = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), 0, 'assigned');
    for (let i = 0; i < result.length; i++) {
        expect(result[i].id).toBeDefined();
        expect(result[i].owner).toBeDefined();
        expect(result[i].title).toBeDefined();
        expect(result[i].subject).toBeDefined();
        expect(result[i].description).toBeDefined();
        expect(result[i].taskset).toBeDefined();
        expect(result[i].group).toBeDefined();
        expect(result[i].final_deadline).toBeDefined();
        expect(result[i].review_deadline).toBeDefined();
    }
});

test('GET /users/:id/exams NOT OK case with selection parameter empty', () => {
    let result = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), 0, '');
    expect(result).toBe('Error in reading <selection> parameter');
});

test('GET /users/:id/exams NOT OK case with selection parameter not valid', () => {
    let result = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), 0, 'banana');
    expect(result).toBe('Error in reading <selection> parameter');
});

test('GET /users/:id/exams NOT OK case with token invalid', () => {
    let result = routerGetUsersExams('bananarama', 0, 'created');
    expect(result).toBe('requester not logged or not authorized');
});

test('GET /users/:id/exams NOT OK case requested id invalid', () => {
    let id = 'a'; //works also with 'null' and not registered id
    let result = routerGetUsersExams(mdb.active_users.getTokenByUserId(0), id, 'created');
    expect(result).toBe(('Failed to retrieve exams for user with specified id: ' + id));
});



// GET /users/:id/exam_submissions

test('GET /users/:id/exam_submissions OK case only one can read only his/her submissions', () => {
    let result = routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(2), 2);
    for (let i = 0; i < result.length; i++) {
        expect(result[i].id).toBeDefined();
        expect(result[i].ref_exam).toBeDefined();
        expect(result[i].submitter).toBeDefined();
        expect(result[i].answer).toBeDefined();
        expect(result[i].status).toBeDefined();
    }
});

test('GET /users/:id/exam_submissions NOT OK case not authorized access', () => {
    let result = routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(0), 2);
    expect(result).toBe('You are authorized to see only your exam submissions');
});

test('GET /users/:id/exam_submissions NOT OK case requested id not valid', () => {
    let id = 'banana';
    let result = routerGetUsersExamSubmissions(mdb.active_users.getTokenByUserId(0), id);
    expect(result).toBe('Failed to retrieve exams for user with specified id: ' + id);
});

test('GET /users/:id/exam_submissions NOT OK case requester (token) not valid', () => {
    let id = 0;
    let result = routerGetUsersExamSubmissions('banana', id);
    expect(result).toBe('requester not logged or not authorized');
});


