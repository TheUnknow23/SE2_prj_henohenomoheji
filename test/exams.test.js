const ajvClass = require('ajv');
const ajv = new ajvClass();
const mdb = require('./../mdb/mdb.js');
const exams = require('./../routes/exams.js');


const email = "geno@geno";
const password = "pwd2";
var token = mdb.active_users.add(mdb.users.getUserByEmail(email));



var examGetSchema = {"type": "object", "required": ["exam_id", "owner_id", "title", "description", "task_set", "group", "final_deadline", "reviews_deadline"], "properties": {"exam_id": {"type": "number"}, "owner_id": {"type": "number"}, "title": {"type": "string"}, "description": {"type": "string"}, "task_set": {"type": "array"}, "group": {"type": "array"}, "final_deadline": {"type": "string"}, "reviews_deadline": {"type": "string"}}}
var examsGetSchema =  {"type": "array", "items" : examGetSchema};


//test for get exam list
test("validate token for get a exam list ", function () {

        expect(exams.getExamlist("dsadawd", "assigned")).toEqual(exams.result401);
});

test("validate selection value for get a exam  list ", function () {

        expect(exams.getExamlist(token, "sadasd")).toEqual(exams.result400);
});

test("validate response for get a exam  list ", function () {
        
        let validate = ajv.compile(examsGetSchema);
        expect(validate(exams.getExamlist(token, "created").body)).toBe(true);
});

//test for post a exam
test("validate token for post a exam", function () {

        expect(exams.postExam("dsadawd", {})).toEqual(exams.result401);

});

test("validate input for post a exam", function () {
        
        expect(exams.postExam(token, {ss: "ws"})).toEqual(exams.result400);

});

test("validate response for post a exam", function () {

        expect(exams.postExam(token, {"title": "a", "description": "sw", "final_deadline": "a", "reviews_deadline": "s"})).toBeGreaterThan(-1);
               

});

//test for get a exam
test("validate token for get a exam", function () {

         expect(exams.getExam("dsadawd", "assigned", 1)).toEqual(exams.result401);
});

test("validate selection value for get a exam", function () {

        expect(exams.getExam(token, "inserris", 1)).toEqual(exams.result401);
});

test("validate exam id for get a exam", function () {

        expect(exams.getExam(token, "assigned", 1999999)).toEqual(exams.result404);
});

test("validate response for get a exam", function () {
        
         let validate = ajv.compile(examGetSchema);
        expect(validate(exams.getExamlist(token, "created", 0).body)).toBe(true);
        
});


//test for put a exam
test("validate token for put a exam", function () {
         expect(exams.putExam("dsadawd", "assigned", 1)).toEqual(exams.result401);

});

test("validate exam id for put a exam", function () {

        expect(exams.postExam(token, {"title": "bbb"}, 1999999)).toEqual(exams.result404);
});


test("validate response for put a exam", function () {

        expect(exams.postExam(token, {"title": "bbb"}, 0).status).toBe(200);

});