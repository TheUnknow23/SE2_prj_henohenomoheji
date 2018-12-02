const express = require('express');
const router = express.Router();
const logic = require('./logic/exam_submission_logic');

router.get('/', function(req, res) {
	console.log("GET exam_submissions/ -> token : " + req.query.token + " | select : " + req.query.select + ")");
	var result = logic.display_exam_submission_list(req.query.token, req.query.select);
	res.status(result.status);
	res.json(result.body);
});

router.post('/', function(req, res){
	console.log("POST exam_submissions/ -> token : " + req.query.token);
	var result = logic.insert_exam_submission(req.query.token, req.body);
	res.status(result.status);
	res.json(result.body);
});

router.get('/:id/', function(req, res){
	console.log("GET exam_submissions/:id -> id : " + req.params.id + " | token : " + req.query.token);
	var result = logic.display_exam_submission(req.query.token, req.params.id);
	res.status(result.status);
	res.json(result.body);
});

router.put('/:id/', function(req, res){
	console.log("PUT exam_submissions/:id -> id : " + req.params.id + " | token : " + req.query.token);
	result = logic.update_exam_submission(req.query.token, req.params.id, req.body);
	res.status(result.status);
	res.json(result.body);
});

router.get('/:id/exam_peer_reviews', function(req, res){
	console.log("GET /:id/exam_peer_reviews -> id : " + req.params.id + " | token : " + req.query.token);
	var result = logic.exam_submission_peer_review_list(req.query.token, req.params.id);
	res.status(result.status);
	res.json(result.body);
});

module.exports = router;
