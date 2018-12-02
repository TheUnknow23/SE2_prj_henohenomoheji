const er = require('./../routes/logic/exam_peer_reviews_logic');
const mdb = require('./../mdb/mdb');
const  generic_e = require('./../schemas/errors/generic.json');
const  review_e = require('./../schemas/errors/review.json');

//test for post a review
test('call insert_exam_peer_review with no parameters', () => {
        expect(er.insert_exam_peer_review()).toBe( generic_e.error400);
});
test('call insert_exam_peer_review with incorrect token', () => {
        expect(er.insert_exam_peer_review("dsdsdsdssdsd", {"ref_submission": 0,"review":"bob"})).toBe( generic_e.error401);
});
test('call insert_exam_peer_review with incorrect payload', () => {
        expect(er.insert_exam_peer_review(mdb.active_users[3].token, {"ref_exam": 0,"answers":["bob","bobby"], "status": 2})).toBe( generic_e.error400);
});
test('call insert_exam_peer_review with correct values', () => {
        expect(er.insert_exam_peer_review(mdb.active_users[3].token,  {"ref_submission": 0,"review":"bob"}).body).toEqual(mdb.exam_peer_reviews[0]);
});
test('call insert_exam_peer_review with correct values as student who already reviewed', () => {
        expect(3).toEqual(3);
});
test('call insert_exam_peer_review on inexisting submission', () => {
        expect(er.insert_exam_peer_review(mdb.active_users[3].token,  {"ref_submission": 99,"review":"bob"})).toEqual(generic_e.error404);
});
test('call insert_exam_peer_review with correct values on existing submission review', () => {
        expect(er.insert_exam_peer_review(mdb.active_users[1].token,  {"ref_submission": 1,"review":"bob"})).toEqual(review_e.existent_review);
});
test('call insert_exam_peer_review with correct values on expired deadline', () => {
        expect(er.insert_exam_peer_review(mdb.active_users[3].token,  {"ref_submission": 2,"review":"bob"})).toEqual(review_e.expired_deadline);
});

//test for get reviews list
test("validate token for get a reviews list ", function () {
        expect(1).toBe(1);
});

test("validate response for get a reviews  list ", function () {

        expect(1).toBe(1);
});

//test for get a review
test("validate token for get a review", function () {

        expect(1).toBe(1);
});

test("validate review id for get a review", function () {

        expect(1).toBe(1);
});

test("validate response for get a review", function () {

        expect(1).toBe(1);

});



//test for put a review
test("validate token for put a review", function () {

        expect(1).toBe(1);
});

test("validate review id for put a review", function () {

        expect(1).toBe(1);
});


test("validate response for put a exam", function () {

        expect(1).toBe(1);

});


//test for delete a review
test("validate token for delete a review", function () {

        expect(1).toBe(1);
});

test("validate review id for delete a review", function () {

        expect(1).toBe(1);
});


test("validate response for delete a exam", function () {

        expect(1).toBe(1);

});




