const express = require('express');
const router = express.Router();
const logic = require('./logic/groups_logic');

/*##### ROUTES CATCH SECTION #####*/

router.get('/',function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(logic.getGroups(req.query.token), null, 3));
});

router.post('/',function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(logic.createGroup(req.body, req.query.token));
});

router.get('/:group_id/', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(logic.getGroup(req.query.token, req.params.group_id), null, 3));
});

router.put('/:group_id/', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(logic.updateGroup(req.params.group_id, req.body, req.query.token));
    //res.sendStatus(mdb.groups.updateById(req.params.id, req.body.name, req.body.description, req.body.members_id));
});

router.delete('/:group_id/', function (req, res) {
    res.setHeader('Content-type', 'application/json');
    res.sendStatus(mdb.groups.deleteById(req.params.id));
});

module.exports = router;