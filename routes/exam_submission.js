const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');
const Ajv = require('ajv');
var ajv = new Ajv();

function display_exam_submission_list(token, type){
	var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
	if(user !== null){
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
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
	var now = new Date();
	console.log("GETTING THE FOLLOWING EXAM SUBMISSION");
	console.log(exam_submission);
	var scheck = ajv.validate(require('./../schemas/exam_submission_post.json'), exam_submission);
	if(scheck){//se il payload ha un formato valido
		var user = mdb.active_users.getUserByToken(token);
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
		if(user !== null){//se l'utente loggato esiste
			var ref_exam = mdb.exams.getExamById(exam_submission.ref_exam);
			if(ref_exam !== undefined){//se esiste l'esame
				console.log("THE EXAM EXIXTS");
				console.log(ref_exam);
				console.log("NOW ->" + now);
				console.log("DEADLINE -> " + ref_exam.final_deadline);
				if(now < ref_exam.final_deadline){//se è entro la data limite
					console.log("VALID DEADLINE");
					if(ref_exam.group.isThere(user)){//se fa parte del gruppo
						console.log("HE IS IN THE GROUP");
						if(!mdb.exam_submissions.hasSubmission(ref_exam, user)){//se non ha già submittato per l'esame
							console.log("HE HASN'T SUBMITTED YET");
							var id = mdb.exam_submissions.add(ref_exam, user, exam_submission.answers, exam_submission.status);
							//after I add the exam submission I serch for a suitable reviewer
							do{
								var r_member = ref_exam.group.getRandomMember(user);
								console.log("..");
							}while(mdb.exam_peer_reviews.hasReview(ref_exam,r_member))
							mdb.exam_peer_reviews.add(r_member, id, "");
							console.log("ASSIGNED THE FOLLOWING REVIEW");console.log(mdb.exam_peer_reviews[mdb.exam_peer_reviews.length-1]);
							return id.id;
						}else{
							console.log("HE ALREADY SUBMITTED AN ANSWER");
						}
					}else{
						console.log("HE IS NOT IN THE GROUP");
					}
				}
			}
		}
	}
	return "error null";
}

router.post('/', function(req, res){
	console.log("POST exam_submissions/ -> token : " + req.query.token);
	res.send("" + insert_exam_submission(req.query.token, req.body));
});

function display_exam_submission(token, id){
	var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
	if(user !== null){
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
		var e_sub = mdb.exam_submissions.getExamSubmissionById(id);
		if(e_sub !== undefined){
			console.log("GOT THE FOLLOWING SUBMISSION"); console.log(e_sub);
			//controllo se è il submitter
			if(e_sub.submitter.id === user.id){
				//prendo la submission
				var submission = e_sub;
				//elimino le soluzioni dal vettore dei task
				for(let i = 0; i < submission.ref_exam.taskset.length; i++){
					submission.ref_exam.taskset[i].solutions = undefined;
				}
				return submission;
			}
			//controllo se è l'owner dell'esame a cui appartiene la submission
			if(e_sub.ref_exam.owner.id === user.id){ 
				return e_sub;
			}
			//controllo se è un reviewer della submission
			console.log("gonna check if " + user.email + " is the reviewer");
			if(mdb.exam_peer_reviews.getReviewerByExamSubmission(e_sub).id === user.id){
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

function update_exam_submission(token, id, updated_submission){
	var now = new Date();
	console.log("GETTING THE FOLLOWING UPDATED SUBMISSION(" + id +")");
	console.log(updated_submission);
	var scheck = ajv.validate(require('./../schemas/exam_submission_put.json'), updated_submission);
	if(scheck){//se il payload ha un formato valido
		console.log("VALID SCHEMA");
		var user = mdb.active_users.getUserByToken(token);
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
		if(user !== null){//se l'utente loggato esiste
			var ref_sub = mdb.exam_submissions.getExamSubmissionById(id);
			if(ref_sub !== undefined){//se esiste la submission
				console.log("SUBMISSION EXISTS");
				if(ref_sub.submitter.id === user.id){//se è submitter della submission
					console.log("USER IS SUBMITTER");
					if(now < ref_sub.ref_exam.final_deadline){//se è entro la data limite
						console.log("VALID DEADLINE");
						var index = mdb.exam_submissions.getIndexById(id)
						console.log("index -> " + index);
						var updated = mdb.exam_submissions[mdb.exam_submissions.getIndexById(id)].update(updated_submission.answers,updated_submission.status);
						return updated.id;
					}
				}else if(ref_sub.ref_exam.owner.id === user.id){
					console.log("USER IS OWNER");
					var updated = mdb.exam_submissions[mdb.exam_submissions.getIndexById(id)].update("","",updated_submission.evaluation);
					return updated.id;
				}
			}
		}
	}
	return "error null";
}

router.put('/:id/', function(req, res){
	console.log("PUT exam_submissions/:id -> id : " + req.params.id + " | token : " + req.query.token);
	res.send("" + update_exam_submission(req.query.token, req.params.id, req.body));
});

function exam_submission_peer_review_list(token, id){
	var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
	if(user !== null){//controllo che l'utente sia loggato
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
		var ref_sub = mdb.exam_submissions.getExamSubmissionById(id);
		if(ref_sub !== undefined){//se esiste la submission
			console.log("SUBMISSION EXISTS");
			if(ref_sub.submitter.id === user.id){//se è submitter della submission
				console.log("USER IS SUBMITTER");
				return mdb.exam_peer_reviews.filterPeerReviewBySubmission(ref_sub);
			}else if(ref_sub.ref_exam.owner.id === user.id){
				console.log("USER IS OWNER");
				return mdb.exam_peer_reviews.filterPeerReviewBySubmission(ref_sub);
			}else if(ref_sub.ref_exam.group.isThere(user)){
				console.log("USER IS IN GROUP")
				return mdb.exam_peer_reviews.filterPeerReviewBySubmission(ref_sub);
			}
		}
	}
	return "error null";
}

router.get('/:id/exam_peer_reviews', function(req, res){
	console.log("GET /:id/exam_peer_reviews -> id : " + req.params.id + " | token : " + req.query.token);
	res.send(exam_submission_peer_review_list(req.query.token, req.params.id));
});

module.exports = router;
module.exports.display_exam_submission = display_exam_submission;/**/
module.exports.display_exam_submission_list = display_exam_submission_list;/**/
module.exports.exam_submission_peer_review_list = exam_submission_peer_review_list;/**/
module.exports.insert_exam_submission = insert_exam_submission;/**/
module.exports.update_exam_submission = update_exam_submission;/**/
