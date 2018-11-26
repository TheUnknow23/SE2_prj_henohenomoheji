const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

/*##### FUNCTION SECTION #####*/

// GET on /groups
function routerGetGroups(token){
    let requester = mdb.active_users.getUserByToken(token);
    if (requester !== null && (requester.type === 'teacher' || requester.type === 'student')){
        return mdb.groups.getAll();
    } else {
        return 'Requester not logged or not authorized'
    }
}

// GET on /groups/:group_id
function routerGetGroup(token, id){
    let requester = mdb.active_users.getUserByToken(token);
    if (requester !== null && (requester.type === 'teacher' || requester.type === 'student')){
        let group = mdb.groups.getGroupById(id);
        if (group !== null){
            return group;
        } else {
            return 'The specified resource doesn\'t exist'
        }
    } else {
        return 'Requester not logged or not authorized'
    }
}

/*##### ROUTES CATCH SECTION #####*/

router.get('/', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(routerGetGroups(req.body.token), null, 3));
});

router.post('/', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    if (mdb.groups.add(mdb.active_users.getUserByToken(req.body.token), req.body.name, req.body.description, req.body.members)){
        res.sendStatus(201);
    } else {
        res.sendStatus(400);
    }
});

router.get('/:group_id', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(routerGetGroup(req.body.token, req.body.id), null, 3));
});

router.put('/:group_id', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(mdb.groups.updateById(req.body.id, req.body.name, req.body.description, req.body.members));
});

router.delete('/:group_id', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(mdb.groups.deleteById(req.body.id));
})

module.exports = router;
