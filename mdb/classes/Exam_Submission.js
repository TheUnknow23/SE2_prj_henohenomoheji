class Exam_Submission{
    /*
    id(integer) PRIMARY KEY
    ref_exam(Exam) FOREIGN KEY
    submitter(User) FOREIGN KEY
    answer(string[])
    status(string)
    evaluation(string)
    */
    constructor(id, ref_exam, submitter, answer, status){
        this.id = id; this.ref_exam = ref_exam; this.submitter = submitter; this.answer = answer; 
        this.status = status; this.evaluation = "";
    }
    update(answer, status, evaluation){
        (answer !== "" || answer !== undefined) ? this.answer = answer : console.log("T_T");
        (status !== "" || status !== undefined) ? this.status = status : console.log("T_T"); 
        (evaluation !== "" || evaluation !== undefined) ? this.evaluation = evaluation : console.log("T_T");
    }
}
class Exam_Submissions extends Array{
    //ADD METHOD
    add(ref_exam, submitter, answer, status, evaluation){
        var x = null;
        if(this.length === 0){
            x = new Exam_Submission(0, ref_exam, submitter, answer, status, evaluation);
        }else{
            x = new Exam_Submission(this[this.length-1].id+1, ref_exam, submitter, answer, status, evaluation);
        }
        if(x !== null){
            this.push(x);
        }
        //console.log("Submissions length : " + this.length);
    }
    //FILTER METHODS
    filterByExam(exam){
        return this.find(obj => obj.ref_exam.id === exam.id);
    }
    filterBySubmitter(submitter){
        return this.filter(obj => obj.submitter.email === submitter.email);
    }
    //GET METHODS
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    getExamSubmissionById(id){
        return this.find(obj => obj.id === id);
    }
    //DELETE METHODS
    deleteById(id){
        var index = this.indexOf(this.find(obj => obj.id === id));
        if(index>=0){
            this.splice(index,1);
        }
    }
}
module.exports = Exam_Submissions;