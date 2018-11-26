
const mdb = require('./../mdb/mdb.js');
const exams = require('./../routes/exams.js');


const email = "geno@geno";
const password = "pwd2";
const token = mdb.active_users.add(mdb.users.getUserByEmail(email));





var testDatiForPost = {"title": "analisi", "description": "sessione2018", "tasks_ids": [0, 1, 2], "group_id": "0", "final_deadline": "11/22", "review_deadline": "11/33"};
var testDatiForPut = {"title": "geometria", "description": "", "tasks_ids": [1, 2], "group_id": "", "final_deadline": "", "review_deadline": ""};

//test for get exam list
test("validate token for get a exam list ", function () {

        expect(exams.getExamlist("dsadawd", "assigned")).toEqual(exams.result401);
});

test("validate selection value for get a exam  list ", function () {

        expect(exams.getExamlist(token, "sadasd")).toEqual(exams.result400);
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

        expect(exams.postExam(token, "sds")).toEqual(exams.result400);

});

test("validate response for post a exam", function () {

        expect(exams.postExam(token, testDatiForPost).body).toBeGreaterThan(0);


});

//test for get a exam
test("validate token for get a exam", function () {

        expect(exams.getExam("dsadawd", 1)).toEqual(exams.result401);
});


test("validate exam id for get a exam", function () {

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
        expect(exams.putExam("dsadawd", testDatiForPut, 1)).toEqual(exams.result401);

});

test("validate exam id for put a exam", function () {

        expect(exams.putExam(token, testDatiForPut, 1999999)).toEqual(exams.result404);
});


test("validate response for put a exam", function () {

        expect(exams.putExam(token, testDatiForPut, 0).status).toBe(200);

});