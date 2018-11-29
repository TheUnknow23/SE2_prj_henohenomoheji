const mdb = require ('../mdb/mdb.js');
const tasks = require('./../routes/tasks.js');
var Ajv = require('ajv');
var ajv = new Ajv();

test('dummy test', () => {
    expect(3).toBe(3);
});

test('Get list of all tasks.', () => {
    let token = mdb.active_users[0].token;
    let result = tasks.getTaskslist(token, "all").body;
    var check = ajv.validate(require('./../schemas/tasks_array_schema.json'), result);
    expect(check).toBe(true);
});

test('Get list of created tasks.', () => {
    let token = mdb.active_users[1].token;
    let result = tasks.getTaskslist(token, "created").body;
    var check = ajv.validate(require('./../schemas/tasks_array_schema.json'), result);
    var car = true;
    if(check){
        for (let i=0; i<result.length && car; i++){
        if(mdb.active_users[1].user.id !== result[i].owner.id) {
                car = false;
            }
        }
    }else{car = false;}
    expect(car).toBe(true);
});

test('Unauthorized user getting list of all tasks.',() => {
    let token = null;
    let result = tasks.getTaskslist(token, "all").body;
    expect(result.message).toBe('Unauthorized, missing or invalid API Key')
});

test('Unauthorized user getting list of all tasks.',() => {
    let token = mdb.active_users[0].token;
    let result = tasks.getTaskslist(token, "234567").body;
    expect(result.message).toBe('Bad Request');
});

test('Tasks not found while requesting for all tasks.', () => {
    let token = mdb.active_users[0].token;
    let result = tasks.getTaskslist(token, "all").body;
    if (result.length == 0 ) {
        expect(result.message).toBe("Not Found");
    }
});

test('Tasks not found when requesting for a specific users task', () => {
    let token = mdb.active_users[1].token;
    let result = tasks.getTaskslist(token, "created").body;
    if (result.length == 0 ) {
        expect(result.message).toBe("Not Found");
    }
});

test('Invalid user in creating task', () => {
    let token = null;
    let body = {"task_type": "cane", "subject": "gatto", "title": "lizard", "description": "gas", "answer": "[opt1]", "solutions": "ababa",}
    let result = tasks.createTask(token, body).body;
    expect(result.message).toBe('Unauthorized, missing or invalid API Key')
});

test('createTask, body format is wrong', () => {
    let token = mdb.active_users[0].token;
    let body = {"task_type": "cane", "subject": "gatto", "title": "lizard", "description": "", "answer": "[opt1]", "solutions": "ababa",}
    let result = tasks.createTask(token, body).body;
    expect(result.message).toBe('Bad Request');
});

test('createtask returns 200 ok', () => {
    let token = mdb.active_users[0].token;
    let body = {"task_type": "cane", "subject": "gatto", "title": "lizard", "description": "gas", "answer": "[opt1]", "solutions": "ababa",}
    let result = tasks.createTask(token, body).body;
    var check = ajv.validate(require('./../schemas/tasks_array_schema.json'), result);
    expect(check).toBe(true);
});
/*
test('accessspecifictask returns 401', () => {
    let token = null;
    let task_id = 2;
    let result = tasks.accessSpecificTask(token, task_id).body;
    expect(result.message).toBe('Unauthorized, missing or invalid API key');
});

test('undefined task id', () => {
    let token = mdb.active_users[0].token;
    let task_id = undefined;
    let result = tasks.accessSpecificTask(token, task_id).body;
    expect(result.message).toBe('Bad Request');
});


test('NaN task id', () => {
    let token = mdb.active_users[0].token;
    let task_id = "stringa";
    let result = tasks.accessSpecificTask(token, task_id).body;
    expect(result.message).toBe('Bad Request');
});

test('updatetask ')
/*
test('Unexpected user requesting tasks.',() => {
    let token = mdb.active_users[0].token;
    
    let result = tasks.getTaskslist(token, "all").body;
    var check = ajv.validate(require('./../schemas/tasks_array_schema.json'), result);
    expect(check).toBe('Unauthorized, missing or invalid API Key')
});
*/