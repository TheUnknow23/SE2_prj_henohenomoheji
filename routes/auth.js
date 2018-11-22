const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

router.get('/', function(req, res) {
        res.send('auth resources');
});

module.exports = router;
