const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');
const Ajv = require ('ajv');
const ajv = new Ajv();
const result400 = {status: 400, body: {code: 400, message: "Bad Request"}};
const result401 = {status: 401, body: {code: 401, message: "Unauthorized, missing or invalid API Key"}};
const result404 = {status: 404, body: {code: 404, message: "Not Found"}};

/*function checkSelection(selection) {
    if (selection == "all") { return 1; }
    if (selection == "created") { return 2; }
    else { return 0; }
}*/

/*function getTaskslist(token, selection) {
    //il risultato da ritornare
    let result;
    //get user
    let user = mdb.active_users.getUserByToken(token);
    //if isn't empty
    if (user === null) {
        result = result401;
    }
    //if isn't valid selection value
    else if (checkSelection(selection) === 0) {
        result = result400;
    } else {
        let body = [];
        if (checkSelection(selection) === 1)
        {
            body=mdb.tasks
        }
        else if (checkSelection(selection) === 2)
        {
            body = mdb.tasks.filterByOwner(user);
        }

        //se body è un array vuoto, significa 404
        if (body.length === 0)
        {
            result = result404;
        }
        else
        {
            result = {};
            result.status = 200;
            result.body = body;
        }

    }

    return result;
}*/

function getTaskslist(token, selection) {
    console.log("GETTTNG LIST OF TASKS");
    let user = mdb.active_users.getUserByToken(token);
    console.log(user);
    
    if (user !==null && user!==undefined){
        switch (selection) {
            case 'all': {
                return {status: 200, body: {code: 200, message: mdb.tasks}};
            }
            case 'created': {
                return {status: 200, body: {code: 200, message: mdb.tasks.filterByOwner(user)}};
            }
            default:{
                return result400;
            }
        }
    }
    return result401;
}

function checkAtt(body){
    if (body.task_type == undefined || body.subject == undefined || body.title == undefined || body.description == undefined || body.solutions == undefined || body.task_type == "" || body.subject == "" || body.title == "" || body.description == "" || body.solutions == "")
    { return false; } else { return true; }
}

function createTask(token, body) {
    //get user
    let user = mdb.active_users.getUserByToken(token);
    //if isn't empty
    if (user !== null&&user !==undefined){
        if (ajv.validate(require('./../schemas/tasks_post.json'), body)&&checkAtt(body)){
            console.log("VALIDATE PASS");
            let result = mdb.tasks.add({id:user.id, email: user.email}, body.task_type,
                body.title, body.subject, body.description, body.answer, body.solutions)
            console.log("RESUKKTT");
            console.log(result);
            return result;
        } else {
            console.log("VALIDATE ERROR");
            return result400;
        }
    } else {
        return result401;
    }
} 
/*let token = mdb.active_users[0].token;
let body = {"id": 20, "owner":{"id":mdb.active_users[0].user.id, "email":mdb.active_users[0].user.email}, "task_type": "pinkiepie", "subject": "gatto", "title": "lizard", "description": "gas", "answer": ["opt1"], "solutions": "ababa"}
console.log("......................................................................................"); console.log(body);
let result = createTask(token, body).body.message;
console.log(result);
var check = ajv.validate(require('./../schemas/tasks_array_schema.json'), result);
console.log(check);*/



function accessSpecificTask(token, task_id) {

    //il risultato da ritornare
    let result;
    //get user
    let user = mdb.active_users.getUserByToken(token);
    //if isn't empty
    if (user === null)
    {
        result = result401;
    }
    //if isn't valid selection value
    else if (task_id === undefined || isNaN(parseInt(task_id)))
    {

        result = result400;
    }
    else
    {

        let idtask = mdb.getTasksById(task_id);
        if (idtask === undefined) {
            return undefined;
        } else {
            result = {};
            result.status = 200;
            result.body = idtask;
        }

    }

    return result;
}

function updateTask(token, body, task_id) {
    //il risultato da ritornare
    let result;
    //get user
    let user = mdb.active_users.getUserByToken(token);
    if (user === null)
    {
        result = result401;
    }
    else if (task_id === undefined || isNaN(parseInt(task_id)))
    {

        result = result400;
    }
    //if isn't valid selection value
    else if (checkAtt(body) == false)
    {
        result = result400;
    }
    else if (mdb.tasks.getTaskById(task_id /* === undefined */) === undefined)
    {
        result = result404;
    } else {

        let Ttype = body.task_type;
        let Tsubj = body.task_subject;
        let Ttitle = body.task_title;
        let Tdescription = body.task_description;
        let Toptions = body.task_options;
        let Tsolutions = body.task_solutions;
        let index = mdb.tasks.getIndexById(task_id);

        mdb.tasks[index].update(Ttype, Tsubj, Ttitle, Tdescription, Toptions, Tsolutions);


        result = {};
        result.status = 200;

    }

    return result;
}

function deleteTask(token, task_id) {
    //il risultato da ritornare
    let result;
    //get user
    let user = mdb.active_users.getUserByToken(token);
    //if isn't empty
    if (user === null)
    {
        result = result401;
    }
    else if (task_id === undefined || isNaN(parseInt(task_id)))
    {

        result = result400;
    }
    //if isn't valid selection value
    else  if (mdb.tasks.getTaskById(task_id) === undefined)
    {
        result = result404;
    } else {

        mdb.tasks.deleteById(task_id);


        result = {};
        result.status = 200;

    }

    return result;
}

router.get('/', function(req, res) {
    let token = req.query.token;
    let selection = req.query.selection;
    console.log("T " + token + ", selection " + selection);
    //get list task
    let result = getTaskslist(token, selection);
    //set codice di stato e risultato
    res.status(result.status);
    res.json(result.body);
});

router.post('/', function(req, res) {
    let token = req.query.token;
    let body = req.body;
    //post task
    let result = createTask(token, body);
    res.status(result.status);
    res.json(result.body);
});

router.get('/:task_id', function(req, res) {
    let token = req.query.token;
    let task_id = req.params.task_id;
    //set codice di stato e risultato
    let result = accessSpecificTask(token, task_id);
    res.status(result.status);
    res.json(result.body);
});

router.put('/:task_id', function(req, res) {
    let token = req.query.token;
    let body = req.body;
    let task_id = req.params.task_id;
    //set codice di stato e risultato
    let result = updateTask(token, body, task_id);
    res.sendStatus(result.status);
});

router.delete('/:task_id', function(req, res) {
    let token = req.query.token;
    let task_id = req.params.task.id;
    //set codice di stato e risultato
    let result = deleteTask(token, task_id);
    res.sendStatus(result.status);
});

module.exports = router;
module.exports.result400 = result400;
module.exports.result401 = result401;
module.exports.result404 = result404;
module.exports.getTaskslist = getTaskslist;
module.exports.createTask = createTask;
module.exports.accessSpecificTask = accessSpecificTask;
module.exports.updateTask = updateTask;
module.exports.deleteTask = deleteTask;
