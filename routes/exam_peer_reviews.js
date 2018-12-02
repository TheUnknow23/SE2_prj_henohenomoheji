const express = require('express');
const router = express.Router();
const logic = require('./logic/exam_peer_reviews_logic');

const result400 = {status: 400, body: {code: 400, message: "Bad Request"}};
const result401 = {status: 401, body: {code: 401, message: "Unauthorized, missing or invalid API Key"}};
const result404 = {status: 404, body: {code: 404, message: "Not Found"}};

router.get('/', function(req, res) {
        res.send('exam_peer_reviews resources');
});

router.post('/', function(req, res){
	var result = logic.insert_exam_peer_review(req.query.token, req.body);
	res.status(result.status);
	res.json(result.body);
});

module.exports.router = router;
module.exports.result400 = result400;
module.exports.result401 = result401;
module.exports.result404 = result404;
