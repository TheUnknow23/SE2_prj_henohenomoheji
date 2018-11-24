const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

function display_exam_submission_list(token){
        return null;
}

function display_exam_submission_to_review_list(token){
        return null;
}

router.get('/', function(req, res) {
        console.log("GET exam_submissions/ -> token : " + req.body.token + " | toreview : " + req.query.toreview + ")");
        if(req.params.toreview === "true"){
                console.log("sending exam submissions to review");
                //res.send(display_exam_submission_to_review_list(req.body.token));
        }else{
                console.log("sending exams submissions of the submitter")
                //res.send(display_exam_submission_list(req.body.token));
        }
        res.send();
});

function insert_exam_submission(token, exam_submission){
        return null;
}

router.post('/', function(req, res){
        console.log("POST exam_submissions/ -> token : " + req.body.token + "\npayload:\n ");
        console.log(req.body.exam_submission);
        //res.send(insert_exam_submission(req.body.token, req.body.exam_submission));
        res.send();
});

function display_exam_submission(token, id){
        /*var id = req.id; //prendo l'id richiesto
        var token = req.token;  //prendo il token passato
        var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token

        //controllo se è il submitter
        if(mdb.exam_submissions.getExamSubmissionById(id).submitter === user){
                //prendo la submission
                var submission = mdb.exam_submissions.getExamById(id);
                //elimino le soluzioni dal vettore dei task
                for(let i = 0; i < submission.ref_exam.taskset.length(); i++){
                        submission.ref_exam.taskset[i].solutions = undefined;
                }
                return submission;
        }

        //controllo se è l'owner dell'esame a cui appartiene la submission
        if(mdb.exam_submissions.getExamSubmissionById(id).ref_exam.owner === user){ 
                return mdb.exam_submissions.getExamById(id);
        }
        //ritorno null se non è autorizzato
        return null;*/
        return null;
}

router.get('/:id', function(req, res){
        console.log("GET exam_submissions/:id -> id : " + req.params.id + " | token : " + req.body.token);
        //res.send(display_exam_submission(req.body.token, req.params.id));
        res.send();
});

function update_exam_submission(token, id, exam_submission){
        return null;
}

router.put('/:id', function(req, res){
        console.log("PUT exam_submissions/:id -> id : " + req.params.id + " | token : " + req.body.token + "\npayload:\n");
        console.log(req.body.exam_submission);
        //res.send(update_exam_submission(req.params.id, req.body.token, req.body.exam_submission));
        res.send();
});

function exam_submission_peer_review_list(token, id){
        return null;
}

router.get('/:id/exam_peer_reviews', function(req, res){
        console.log("GET /:id/exam_peer_reviews -> id : " + req.params.id + " | token : " + req.body.token);
        //res.send(exam_submission_peer_review_list(req.body.token, req.params.id));
        res.send();
});

function insert_exam_peer_review(token, id, exam_peer_review){
        return null;
}

router.post('/:id/exam_peer_reviews', function(req, res){
        console.log("POST /:id/exam_peer_reviews -> id : " + req.params.id + " | token : " + req.body.token + "\npayload\n");
        console.log(req.body.exam_peer_review);
        //res.send(insert_exam_peer_review(req.body.token, req.params.id, req.body.exam_peer_review));
        res.send();
});

module.exports = router;
module.exports.display_exam_submission = display_exam_submission;
module.exports.display_exam_submission_list = display_exam_submission_list;
module.exports.display_exam_submission_to_review_list = display_exam_submission_to_review_list;
module.exports.exam_submission_peer_review_list = exam_submission_peer_review_list;
module.exports.insert_exam_peer_review = insert_exam_peer_review;
module.exports.insert_exam_submission = insert_exam_submission;
module.exports.update_exam_submission = update_exam_submission;
