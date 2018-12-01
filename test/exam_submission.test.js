const es = require('./../routes/logic/exam_submission_logic');
const mdb = require('./../mdb/mdb');
const errors = require('./../schemas/errors/generic.json');
test('dummy test', () => {
    console.log("sdsadasdaddadd");
    expect(3).toBe(3);
});
//display_exam_submission() tests/*X*/
test('call display_exam_submission with no paramaters', () => {
    expect(es.display_exam_submission()).toBe(errors.error401);
});
test('call display_exam_submission with no incorrect token', () => {
    expect(es.display_exam_submission("dsddsddddddddddddddd", 1)).toBe(errors.error401);
});
test('call display_exam_submission with no incorrect id', () => {
    expect(es.display_exam_submission(mdb.active_users[0].token, 928928)).toBe(errors.error404);
});
test('call display_exam_submission with correct token and id(as owner)', () => {
    expect(es.display_exam_submission(mdb.active_users.getTokenByUserId(1), 0).body).toBe(mdb.exam_submissions[0]);
});
test('call display_exam_submission with correct token and id(as submitter)', () => {
    expect(es.display_exam_submission(mdb.active_users[1].token, 0).body).toBe(mdb.exam_submissions[0]);
});
test('call display_exam_submission with correct token and id(as reviewer)', () => {
    expect(es.display_exam_submission(mdb.active_users[3].token, 0).body).toBe(mdb.exam_submissions[0]);
});

//display_exam_submission_list() tests/*X*/
test('call display_exam_submission_list with no parameters', () => {
    expect(es.display_exam_submission_list()).toBe(errors.error400);
});
test('call display_exam_submission_list with incorrect token', () => {
    expect(es.display_exam_submission_list("dsdsdsdssdsd", "toreview")).toBe(errors.error401);
});
test('call display_exam_submission_list with just the token', () => {
    expect(es.display_exam_submission_list(mdb.active_users[0].token)).toEqual(errors.error400);
});
test('call display_exam_submission_list with incorrect query param', () => {
    expect(es.display_exam_submission_list(mdb.active_users[3].token, "torevifew")).toBe(errors.error400);
});
test('call display_exam_submission_list with correct values (select=owned)', () => {
    expect(es.display_exam_submission_list(mdb.active_users[0].token, "owned").body).toEqual(mdb.exam_submissions);
});
test('call display_exam_submission_list with correct values (select=toreview)', () => {
    expect(es.display_exam_submission_list(mdb.active_users[3].token, "toreview").body).toEqual([mdb.exam_submissions[0]]);
});
test('call display_exam_submission_list with correct values (select=reviewed)', () => {
    expect(es.display_exam_submission_list(mdb.active_users[3].token, "reviewed").body).toEqual([]);
});

//insert_exam_submission() tests
test('call insert_exam_submission with no parameters', () => {
    expect(es.insert_exam_submission()).toBe(errors.error400);
});
test('call insert_exam_submission with incorrect token', () => {
    expect(es.insert_exam_submission("dsdsdsdssdsd", {"ref_exam": 0,"answers":["bob","bobby"], "status": "on hold"})).toBe(errors.error401);
});
test('call insert_exam_submission with incorrect payload', () => {
    expect(es.insert_exam_submission(mdb.active_users[2].token, {"ref_exam": 0,"answers":["bob","bobby"], "status": 2})).toBe(errors.error400);
});
test('call insert_exam_submission with correct values', () => {
    expect(es.insert_exam_submission(mdb.active_users[2].token,  {"ref_exam": 0,"answers":["bob","bobby"], "status": "on hold"}).body).toEqual(mdb.exam_submissions[2]);
});

//update_exam_submission() tests
test('call update_exam_submission with no parameters', () => {
    expect(es.update_exam_submission()).toBe(errors.error400);
});
test('call update_exam_submission with incorrect token', () => {
    expect(es.update_exam_submission("dsdsdsdssdsd", 0, {"ref_exam": 0,"answers":["bob","bobby"], "status": "on hold"})).toBe(errors.error401);
});
test('call update_exam_submission with incorrect payload', () => {
    expect(es.update_exam_submission(mdb.active_users[1].token, {"ref_exam": 0})).toBe(errors.error400);
});
test('call update_exam_submission with correct values as submitter', () => {
    expect(es.update_exam_submission(mdb.active_users[1].token,  0, {"answers":["bob","bobby"], "status": "completed"}).body).toEqual(mdb.exam_submissions[0]);
});
test('call update_exam_submission with correct values as owner of the exam', () => {
    expect(es.update_exam_submission(mdb.active_users[1].token,  0, {"evaluation": "good"}).body).toEqual(mdb.exam_submissions[0]);
});

//exam_submission_peer_review_list() tests
test('call exam_submission_peer_review_list with incorrect token', () => {
    expect(es.exam_submission_peer_review_list("dsdsdsdssdsd")).toBe(errors.error401);
});
test('call exam_submission_peer_review_list with correct values as submitter', () => {
    expect(es.exam_submission_peer_review_list(mdb.active_users[1].token,  0).body).toEqual([mdb.exam_peer_reviews[0]]);
});
test('call exam_submission_peer_review_list with correct values as submitter - 2', () => {
    expect(es.exam_submission_peer_review_list(mdb.active_users[2].token,  1).body).toEqual([mdb.exam_peer_reviews[1]]);
});
test('call exam_submission_peer_review_list with correct values as group member', () => {
    expect(es.exam_submission_peer_review_list(mdb.active_users[3].token,  1).body).toEqual([mdb.exam_peer_reviews[1]]);
});