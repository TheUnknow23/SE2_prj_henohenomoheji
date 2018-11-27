const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');
const Ajv = require ('ajv');
const ajv = new Ajv();

const postSchema = require('./../schemas/groups_post_schema.json');
const putSchema = require('./../schemas/groups_put_schema.json');

/*##### FUNCTION SECTION #####*/

// GET on /groups
function getGroups(token){
    const requester = mdb.active_users.getUserByToken(token);
    if (requester !== null /*&& (requester.type === 'teacher' || requester.type === 'student')*/){
        return mdb.groups.getAll();
    } else {
        return 'Requester not logged or not authorized'
    }
}

// GET on /groups/:group_id
function getGroup(token, id){
    let requester = mdb.active_users.getUserByToken(token);
    if (requester !== null /*&& (requester.type === 'teacher' || requester.type === 'student')*/){
        let group = mdb.groups.getGroupById(id);
        console.log(group);
        if (group !== null&&group !==undefined){
            return group;
        } else {
            return 'The specified resource doesn\'t exist'
        }
    } else {
        return 'Requester not logged or not authorized'
    }
}

// POST on /groups
function createGroup (body){
    console.log(body);
    if(ajv.validate(postSchema, body)) {
        if (mdb.groups.add(mdb.active_users.getUserByToken(body.token), body.name, body.description, body.members)) {
            return 201;
        } else {
            return 400;
        }
    } else {
        return 400;
    }
}

// PUT on /groups/:group_id
function updateGroup(id, body){
    if (ajv.validate(putSchema, body)){
        return mdb.groups.updateById(id, body.name, body.description, body.members);
    } else {
        return 400;
    }
}

/*##### ROUTES CATCH SECTION #####*/

router.get('/',function(req, res) {
    res.setHeader('Content-type', 'application/json');
    console.log(req.query);
    res.send(JSON.stringify(getGroups(req.query.token), null, 3));
});

router.post('/',function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(createGroup(req.body));
});

router.get('/:group_id', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    console.log(req.query);
    res.send(JSON.stringify(getGroup(req.query.token, req.params.id), null, 3));
});

router.put('/:group_id', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(updateGroup(req.params.id, req.body));
    //res.sendStatus(mdb.groups.updateById(req.params.id, req.body.name, req.body.description, req.body.members));
});

router.delete('/:group_id', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(mdb.groups.deleteById(req.params.id));
});

module.exports = router;
module.exports.getGroups = getGroups;
module.exports.getGroup = getGroup;
module.exports.createGroup = createGroup;
module.exports.updateGroup = updateGroup;