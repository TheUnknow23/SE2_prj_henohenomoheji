const mdb = require ('./../../mdb/mdb');
const  generic_e = require('./../../schemas/errors/generic.json');
const  review_e = require('./../../schemas/errors/review.json');
const Ajv = require('ajv');
var ajv = new Ajv();


function insert_exam_peer_review(token, exam_review){
    var now = new Date();
	var scheck = ajv.validate(require('./../../schemas/payloads/exam_peer_review_post.json'), exam_review);
	if(scheck){//se il payload ha un formato valido
		var user = mdb.active_users.getUserByToken(token);
		if(user !== null){//se l'utente loggato esiste
			var ref_sub = mdb.exam_submissions.getExamSubmissionById(exam_review.ref_submission);
			if(ref_sub !== undefined){//se esiste la submission
				if(now < ref_sub.ref_exam.review_deadline){//se è entro la data limite
                    var idx = mdb.exam_peer_reviews.getIndexByUserAndSubmission(user, ref_sub);
					if(idx >= 0){//se è stato assegnato come reviewer
						if(mdb.exam_peer_reviews[idx].review === ""){//se non ha già submittato una review
							var review = mdb.exam_peer_reviews[idx].update("", "", exam_review.review);
							return {"status": 201, "body": review};
						}else{//there's already a review
							return  review_e.existent_review;
						}
					}else{//the user is not the reviewer
						return  generic_e.error401;
					}
				}else{//the deadline expired
					return  review_e.expired_deadline;
				}
			}else{//the submission does not exist
				return  generic_e.error404;
			}
		}else{//the token is not correct
			return  generic_e.error401;
		}
	}else{//the payload doesn't respect the schema
		return  generic_e.error400;
	}
}


/**
 * Serves as logic response to PUT call to /exam_peer_review/:id
 * @param {*} token token of calling user
 * @param {*} id id of review to update
 */
function routerUpdateReview(token, id, updatedReview){

	if (arguments.length !== 3 ) {
		return generic_e.error400;
	}

	let requester = mdb.active_users.getUserByToken(token);
	//Index call returns actual saved object to be modified
	let dataIndex = mdb.exam_peer_reviews.getIndexById(id);
	//Review to update not found
	if (dataIndex === -1) {
		return generic_e.error404;
	}
	
	let examReviewToUpdate = mdb.exam_peer_reviews[dataIndex];
	let schemaCheck = ajv.validate(require('./../../schemas/payloads/exam_peer_review_put.json'), updatedReview);

	//Input not valid
	if (!schemaCheck) {
		return generic_e.error400;
	}
	//Requester non logged or non reviewer
	if (!(requester !== null && requester.id === examReviewToUpdate.reviewer.id)) {
		return generic_e.error401;
	}

	//Actual code
	let res = examReviewToUpdate.update(updatedReview, "").id;
	return ('Modified review with id: ' + res);
}

module.exports.insert_exam_peer_review = insert_exam_peer_review;
module.exports.routerUpdateReview = routerUpdateReview;