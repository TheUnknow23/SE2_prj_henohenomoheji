class Exam_Peer_Review{
    /*
    id(integer) PRIMARY KEY
    reviewer(User) FOREIGN KEY
    submission(Exam_Submission) FOREIGN KEY
    review(string)
    */
    constructor(id, reviewer, submission, review){
        this.id = id;this.reviewer = reviewer; this.submission = submission; this.review = review;
    }
    update(review, submission){
        (review !== "" && review !== undefined) ? this.review = review : console.log("T_T");
        (submission !== "" && submission !== undefined) ? this.submission = submission : console.log("T_T");
        return this;
    }
}
class Exam_Peer_Reviews extends Array{
    //ADD METHOD
    add(reviewer, submission, review){
        var x = null;
        if(this.length === 0){
            x = new Exam_Peer_Review(0, reviewer, submission, review);
        }else{
            x = new Exam_Peer_Review(this[this.length-1].id+1, reviewer, submission, review);
        }
        if(x !== null){
            this.push(x);
        }
        //console.log("Reviews length : " + this.length);
    }
    //FILTER METHODS
    filterBySubmitter(reviewer){
        return this.filter(obj => obj.reviewer.email === reviewer.email);
    }
    filterExamSubmissionByReviewer(reviewer, type){
        var rev = undefined;
        if(type === "toreview"){
            rev = this.filter(obj => (obj.reviewer.email === reviewer.email && obj.review === ""));
        }else if(type === "reviewed"){
            rev = this.filter(obj => (obj.reviewer.email === reviewer.email && obj.review !== ""));
        }else{
            rev = this.filter(obj => (obj.reviewer.email === reviewer.email));
        }
        rev = rev.map(obj => obj.submission);
        return rev;
    }
    filterByExam(exam){
        return this.filter(obj => obj.submission.ref_exam.id === exam.id);
    }
    filterPeerReviewBySubmission(submission){
        console.log("SERACHING THE FOLLOWING SUBMISSION");
        console.log(submission);
        var rev;
        rev = this.filter(obj => (obj.submission === submission));
        console.log("FOUND THIS");console.log(rev);
        return rev;
    }
    //GET METHODS
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    getReviewerByExamSubmission(submission){
        var rev = this.find(obj => obj.submission === submission);
        if(rev !== undefined){
            return rev.reviewer;
        }
        return undefined;
    }
    findById(id){
        return this.find(obj => obj.id === id);
    }
    //DELETE METHODS
    deleteById(id){
        var index = this.indexOf(this.find(obj => obj.id === id));
        if(index>=0){
            this.splice(index,1);
        }
    }
    hasReview(exam, user){//checks is there's already an review for the given exam and user
        var rev = this.find(obj => (obj.submission.ref_exam === exam && obj.reviewer === user));
        //console.log("found the following review ->");console.log(rev);
        if(rev !== undefined){
            return true;
        }
        return false;
    }
    //UPDATE METHODS
    updateSubmission(submission){
        for(let i = 0; i < this.length; i++){
            if(this[i].submission.id === submission.id){
                this[i].update("",submission);
            }
        }
    }
}
module.exports = Exam_Peer_Reviews;