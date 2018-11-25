const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');
const Ajv = require('ajv');
var ajv = new Ajv();

var schema = {
        type: "object",
        properties: {
          lol: {
                  type: "number"
          }
        }
      };
function display_exam_submission_list(token, type){
        var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
        if(user !== null){
                if(type === "submitted"){
                        console.log("sending submitted exam submissions");
                        return mdb.exam_submissions.filterBySubmitter(user);
                }else if(type === "owned"){
                        console.log("sending submissions of owned exams");
                        return mdb.exam_submissions.filterByExamOwner(user);
                }else if(type === "toreview"){
                        console.log("sending submissions to review");
                        return mdb.exam_peer_reviews.filterExamSubmissionByReviewer(user);
                }else{
                        return "error null";
                }
        }else{
                return "error null";
        }
}

router.get('/', function(req, res) {
        console.log("GET exam_submissions/ -> token : " + req.query.token + " | select : " + req.query.select + ")");
        res.send(display_exam_submission_list(req.query.token, req.query.select));
});

function insert_exam_submission(token, exam_submission){
	console.log("GETTING THE FOLLOWING EXAM SUBMISSION");
        console.log(exam_submission);
        console.log(ajv.validate(schema, exam_submission));
        return null;
}

router.post('/', function(req, res){
        console.log("POST exam_submissions/ -> token : " + req.query.token);
        res.send(insert_exam_submission(req.query.token, req.body));
});

function display_exam_submission(token, id){
        var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
        if(user !== null){
                var e_sub = mdb.exam_submissions.getExamSubmissionById(id);
                if(e_sub !== undefined){
                        //controllo se è il submitter
                        if(e_sub.submitter === user){
                                //prendo la submission
                                var submission = e_sub;
                                //elimino le soluzioni dal vettore dei task
                                for(let i = 0; i < submission.ref_exam.taskset.length; i++){
                                        submission.ref_exam.taskset[i].solutions = undefined;
                                }
                                return submission;
                        }
                        //controllo se è l'owner dell'esame a cui appartiene la submission
                        if(e_sub.ref_exam.owner === user){ 
                                return e_sub;
                        }
                        //controllo se è un reviewer della submission
                        console.log("gonna check if " + user.name + " is the reviewer");
                        if(mdb.exam_peer_reviews.getReviewerByExamSubmission(e_sub) === user){
                                return e_sub;
                        }
                }
        }
        return "error null";
}

router.get('/:id/', function(req, res){
        console.log("GET exam_submissions/:id -> id : " + req.params.id + " | token : " + req.query.token);
        res.send(display_exam_submission(req.query.token, req.params.id));
        //res.send();
});

function update_exam_submission(token, id, exam_submission){
        return null;
}

router.put('/:id/', function(req, res){
        console.log("PUT exam_submissions/:id -> id : " + req.params.id + " | token : " + req.query.token + "\npayload:\n");
        console.log(req.body.exam_submission);
        //res.send(update_exam_submission(req.params.id, req.query.token, req.body.exam_submission));
        res.send();
});

function exam_submission_peer_review_list(token, id){
        return null;
}

router.get('/:id/exam_peer_reviews', function(req, res){
        console.log("GET /:id/exam_peer_reviews -> id : " + req.params.id + " | token : " + req.query.token);
        //res.send(exam_submission_peer_review_list(req.query.token, req.params.id));
        res.send();
});

function insert_exam_peer_review(token, id, exam_peer_review){
        return null;
}

router.post('/:id/exam_peer_reviews', function(req, res){
        console.log("POST /:id/exam_peer_reviews -> id : " + req.params.id + " | token : " + req.query.token + "\npayload\n");
        console.log(req.body.exam_peer_review);
        //res.send(insert_exam_peer_review(req.query.token, req.params.id, req.body.exam_peer_review));
        res.send();
});

module.exports = router;
module.exports.display_exam_submission = display_exam_submission;
module.exports.display_exam_submission_list = display_exam_submission_list;
module.exports.exam_submission_peer_review_list = exam_submission_peer_review_list;
module.exports.insert_exam_peer_review = insert_exam_peer_review;
module.exports.insert_exam_submission = insert_exam_submission;
module.exports.update_exam_submission = update_exam_submission;
