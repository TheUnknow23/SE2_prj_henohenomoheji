const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

router.get('/', function(req, res) {
        res.send('exam_peer_reviews resources');
});

module.exports = router;
