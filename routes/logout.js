const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');
const logic = require('./logic/logout_logic');

router.get('/', function(req, res) {
        var data = logic.logoutFunction(req.query.token);
        res.sendStatus(data.status);
});

module.exports = router;
