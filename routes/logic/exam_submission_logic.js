const mdb = require ('./../../mdb/mdb');
const errors = require('./../../schemas/errors/generic.json');
const Ajv = require('ajv');
var ajv = new Ajv();

/**
 * gets the list of exam_submissions, the user can select a type of exam submissions >
 * - submitted: submissions made by the user requesting the service
 * - owned: submissions relative to the owned exams
 * - toreview(TO FIX): submissions to review
 * - reviewed(TO DO): submissions that the user already reviewed
 * @param {string} token of the active user
 * @param {string} type of selection
 * @returns {object} array of exam submissions or an error
 */
function display_exam_submission_list(token, type){
	if(token === undefined || type === undefined){
		return errors.error400;
	}
	var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
	if(user !== null){
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
		if(type === "submitted"){
			console.log("sending submitted exam submissions");
			return {"status": 200, "body": mdb.exam_submissions.filterBySubmitter(user)};
		}else if(type === "owned"){
			console.log("sending submissions of owned exams");
			return {"status": 200, "body": mdb.exam_submissions.filterByExamOwner(user)};
		}else if(type === "toreview" || type === "reviewed"){
			console.log("sending submissions to review");
			return {"status": 200, "body": mdb.exam_peer_reviews.filterExamSubmissionByReviewer(user,type)};
		}else{
			return errors.error400;
		}
	}else{
		return errors.error401;
	}
}

/**
 * requires an exam_submssion object with an id reffering to an exam and adds it to the mdb
 * @param {string} token 
 * @param {object} exam_submission 
 * @returns {object} copy of created exam submission or error
 */
function insert_exam_submission(token, exam_submission){
	var now = new Date();
	console.log("GETTING THE FOLLOWING EXAM SUBMISSION");
	console.log(exam_submission);
	var scheck = ajv.validate(require('./../../schemas/payloads/exam_submission_post.json'), exam_submission);
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
							var submission = mdb.exam_submissions.add(ref_exam, user, exam_submission.answers, exam_submission.status);
							//after I add the exam submission I serch for a suitable reviewer
							do{
								var r_member = ref_exam.group.getRandomMember(user);
								console.log("..");
							}while(mdb.exam_peer_reviews.hasReview(ref_exam,r_member))
							mdb.exam_peer_reviews.add(r_member, submission, "");
							console.log("ASSIGNED THE FOLLOWING REVIEW");console.log(mdb.exam_peer_reviews[mdb.exam_peer_reviews.length-1]);
							return {"status": 201, "body": submission};
						}else{//there's already a submission
							return errors.error400;
						}
					}else{//the user is not in the group
						return errors.error401;
					}
				}else{//the deadline expired
					return errors.error400;
				}
			}else{//the exam does not exist
				return errors.error400;
			}
		}else{//the token is not correct
			return errors.error401;
		}
	}else{//the payload doesn't respect the schema
		return errors.error400;
	}
}

/**
 * displays the details of the requested exam_submission, this works only if you're the submitter or
 * the owner of the exam the submission refers to
 * @param {string} token 
 * @param {int} id
 * @returns {object} an exam submission or an error 
 */
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
				return {"status": 200, "body": e_sub};
			}
			//controllo se è l'owner dell'esame a cui appartiene la submission
			if(e_sub.ref_exam.owner.id === user.id){ 
				return {"status": 200, "body": e_sub};
			}
			//controllo se è un reviewer della submission
			console.log("gonna check if " + user.email + " is the reviewer");
			if(mdb.exam_peer_reviews.getReviewerByExamSubmission(e_sub).id === user.id){
				return {"status": 200, "body": e_sub};
			}
		}else{
			return errors.error404;
		}
	}else{
		return errors.error401;
	}
}

/**
 * 
 * @param {string} token 
 * @param {int} id 
 * @param {object} updated_submission 
 * @returns {object} the updated version of the submission or an error
 */
function update_exam_submission(token, id, updated_submission){
	var now = new Date();
	console.log("GETTING THE FOLLOWING UPDATED SUBMISSION(" + id +")");
	console.log(updated_submission);
	var scheck = ajv.validate(require('./../../schemas/payloads/exam_submission_put.json'), updated_submission);
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
						return {"status": 200, "body": updated};
					}
				}else if(ref_sub.ref_exam.owner.id === user.id){
					console.log("USER IS OWNER");
					var updated = mdb.exam_submissions[mdb.exam_submissions.getIndexById(id)].update("","",updated_submission.evaluation);
					return {"status": 200, "body": updated};
				}
			}else{//the requested resource does not exists
				return errors.error404;
			}
		}else{//the user has incorrect token
			return errors.error401;
		}
	}else{//the payload has not a valid format
		return errors.error400;
	}
}

/**
 * returns the reviews array of a submission, this works if you're the creator of the submission,
 * the owner of the exam regarding the submission or one of the exam assignees
 * @param {string} token 
 * @param {int} id
 * @returns {object} reviews array of the selected submission or an error 
 */
function exam_submission_peer_review_list(token, id){
	var user = mdb.active_users.getUserByToken(token); //mi prendo l'utente attivo relativo al token
	if(user !== null){//controllo che l'utente sia loggato
		console.log("THE USER REQUESTING THE SERVICE IS"); console.log(user);
		var ref_sub = mdb.exam_submissions.getExamSubmissionById(id);
		if(ref_sub !== undefined){//se esiste la submission
			console.log("SUBMISSION EXISTS");
			if(ref_sub.submitter.id === user.id){//se è submitter della submission
				console.log("USER IS SUBMITTER");
				return {"status": 200, "body": mdb.exam_peer_reviews.filterPeerReviewBySubmission(ref_sub)};
			}else if(ref_sub.ref_exam.owner.id === user.id){
				console.log("USER IS OWNER");
				return {"status": 200, "body": mdb.exam_peer_reviews.filterPeerReviewBySubmission(ref_sub)};
			}else if(ref_sub.ref_exam.group.isThere(user)){
				console.log("USER IS IN GROUP")
				return {"status": 200, "body": mdb.exam_peer_reviews.filterPeerReviewBySubmission(ref_sub)};
			}
		}else{//the submissions does not exist
			return errors.error404;
		}
	}else{//incorrect token
		return errors.error401;
	}
}
console.log("YEE HAW!");
console.log(mdb.groups);
mdb.users[3].update("", "", "3@3", "");
console.log(mdb.exam_peer_reviews[0]);
mdb.users[2].update("", "", "2@2", "");
mdb.users[1].update("", "", "1@1", "");
mdb.users[0].update("", "", "0@0", "");
mdb.tasks[2].update("", "", "", "updated description", "", "");
console.log("updated exam submission");
console.log(mdb.exam_submissions[0]);
console.log("updated review");
console.log(mdb.exam_peer_reviews[0]);

module.exports.display_exam_submission = display_exam_submission;/**/
module.exports.display_exam_submission_list = display_exam_submission_list;/**/
module.exports.exam_submission_peer_review_list = exam_submission_peer_review_list;/**/
module.exports.insert_exam_submission = insert_exam_submission;/**/
module.exports.update_exam_submission = update_exam_submission;/**/
