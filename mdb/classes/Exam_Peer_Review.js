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
    update(review){
        (review !== "" || review !== undefined) ? this.review = review : console.log("T_T");
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
        console.log("Reviews length : " + this.length);
    }
    //FIND METHODS
    findById(id){
        return this.find(obj => obj.id === id);
    }
    //FILTER METHODS
    filterBySubmitter(reviewer){
        return this.filter(obj => obj.reviewer.email === reviewer.email);
    }
    filterByExam(exam){
        return this.filter(obj => obj.submission.ref_exam.id === exam.id);
    }
    //GET METHODS
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    //DELETE METHODS
    deleteById(id){
        if(id>=0){
            this.splice(id,1);
        }
    }
}
module.exports = Exam_Peer_Reviews;