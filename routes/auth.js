const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

router.get('/', function(req, res) {
        res.send(mdb.active_users.getTokenByUser({email: "gino@gino"}));
});

module.exports = router;
