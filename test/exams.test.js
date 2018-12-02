
const mdb = require('./../mdb/mdb.js');
const exams = require('./../routes/exams.js');


const email = "geno@geno";
const password = "pwd2";
const token = mdb.active_users[0].token;
const token2 = mdb.active_users[3].token;


//dati giusta
var testDati1 = {"title": "analisi", "description": "sessione2018", "tasks_ids": [0, 1, 2], "group_id": "0", "final_deadline": "2018-11-22", "review_deadline": "2018-11-25"};
var testDati2 = {"title": "geometria", "description": "sessione2018", "tasks_ids": "", "group_id": "", "final_deadline": "2018-11-22", "review_deadline": "2018-11-23"};
//dati errata
//manca dati description
var testDati3 = {"title": "analisi", "description": "", "tasks_ids": [0, 1, 2], "group_id": "0", "final_deadline": "2018-11-22", "review_deadline": "2018-11-25"};
//review data errata
var testDati4 = {"title": "analisi", "description": "sessione2018", "tasks_ids": [0, 1, 2], "group_id": "0", "final_deadline": "2018-11-25", "review_deadline": "2018-11-25"};

//test for get exam list
test("validate token for get a exam list ", function () {

        expect(exams.getExamlist("dsadawd", "assigned")).toEqual(exams.result401);
});

test("validate selection value for get a exam  list ", function () {//

        expect(exams.getExamlist(token, "sadasd")).toEqual(exams.result400);
});

test("validate response 404 for get a exam  list ", function () {

        expect(exams.getExamlist(token2, "created")).toEqual(exams.result404);
});

test("validate response for get a exam  list ", function () {

        const body = exams.getExamlist(token, "created").body;
        expect(body.length).toBeDefined();
        expect(body[0].id).toBeDefined();
        expect(body[0].owner).toBeDefined();
        expect(body[0].title).toBeDefined();
        expect(body[0].description).toBeDefined();
        expect(body[0].taskset).toBeDefined();
        expect(body[0].group).toBeDefined();
        expect(body[0].final_deadline).toBeDefined();
        expect(body[0].review_deadline).toBeDefined();

});

//test for post a exam
test("validate token for post a exam", function () {

        expect(exams.postExam("dsadawd", {})).toEqual(exams.result401);

});

test("validate input for post a exam", function () {

        expect(exams.postExam(token, testDati3)).toEqual(exams.result400);
        expect(exams.postExam(token, testDati4)).toEqual(exams.result400);
        
});

test("validate response for post a exam", function () {

        expect(exams.postExam(token, testDati1).body).toBeGreaterThan(0);


});

//test for get a exam
test("validate token for get a exam", function () {

        expect(exams.getExam("dsadawd", 1)).toEqual(exams.result401);
});


test("validate exam id for get a exam", function () {

        expect(exams.getExam(token, "ersada")).toEqual(exams.result400);
});
test("validate response404  by exam not exist for get a exam", function () {

        expect(exams.getExam(token, 1999999)).toEqual(exams.result404);
});

test("validate response for get a exam", function () {


        let body = exams.getExam(token, 0).body;
        expect(body.id).toBeDefined();
        expect(body.owner).toBeDefined();
        expect(body.title).toBeDefined();
        expect(body.description).toBeDefined();
        expect(body.taskset).toBeDefined();
        expect(body.group).toBeDefined();
        expect(body.final_deadline).toBeDefined();
        expect(body.review_deadline).toBeDefined();


});


//test for put a exam
test("validate token for put a exam", function () {
        expect(exams.putExam("dsadawd", testDati2, 1)).toEqual(exams.result401);

});

test("validate exam id for put a exam", function () {

        expect(exams.putExam(token, testDati2, "dasd")).toEqual(exams.result400);
});
test("validate response404  by exam not exist ", function () {

        expect(exams.putExam(token, testDati2, 1999999)).toEqual(exams.result404);
});


test("validate input for put a exam", function () {

        expect(exams.putExam(token, testDati3, 0)).toEqual(exams.result400);
        expect(exams.putExam(token, testDati4, 0)).toEqual(exams.result400);
        
});

test("validate response for put a exam", function () {

        expect(exams.putExam(token, testDati2, 0).status).toBe(200);

});



//test for get submission list of exam
test("validate token for get a submission list of exam ", function () {

        expect(exams.getSubmissionsOfExam("dsadawd", 0)).toEqual(exams.result401);
});

test("validate exam id for get a submission list of exam ", function () {

        expect(exams.getSubmissionsOfExam(token, "uno-due")).toEqual(exams.result400);
});


test("validate response 404 by there isn't exam with current id for get a submission list of exam", function () {

        expect(exams.getSubmissionsOfExam(token, 99999)).toEqual(exams.result404);
});

test("validate response 404 by there aren't any submissions with current exam  for get a submission list of exam", function () {

        expect(exams.getSubmissionsOfExam(token, 2)).toEqual(exams.result404);
});

test("validate response for get a submission list of exam", function () {

        const body = exams.getSubmissionsOfExam(token, 0).body;
        expect(body.length).toBeDefined();
        expect(body[0].ref_exam).toBeDefined();
        expect(body[0].submitter).toBeDefined();
        expect(body[0].answer).toBeDefined();
        expect(body[0].status).toBeDefined();
        expect(body[0].evaluation).toBeDefined();

});