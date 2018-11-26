const es = require('./../routes/exam_submission');
const mdb = require('./../mdb/mdb');
test('dummy test', () => {
    console.log("sdsadasdaddadd");
    expect(3).toBe(3);
});

//display_exam_submission() tests
test('call display_exam_submission with no paramaters', () => {
    expect(es.display_exam_submission()).toBe("error null");
});
test('call display_exam_submission with no incorrect token', () => {
    expect(es.display_exam_submission("dsddsddddddddddddddd", 1)).toBe("error null");
});
test('call display_exam_submission with no incorrect id', () => {
    expect(es.display_exam_submission(mdb.active_users[0].token, 928928)).toBe("error null");
});
test('call display_exam_submission with correct token and id(as owner)', () => {
    expect(es.display_exam_submission(mdb.active_users[0].token, 0)).toBe(mdb.exam_submissions[0]);
});
test('call display_exam_submission with correct token and id(as submitter)', () => {
    expect(es.display_exam_submission(mdb.active_users[1].token, 0)).toBe(mdb.exam_submissions[0]);
});
test('call display_exam_submission with correct token and id(as reviewer)', () => {
    expect(es.display_exam_submission(mdb.active_users[3].token, 0)).toBe(mdb.exam_submissions[0]);
});

//display_exam_submission_list() tests
test('call display_exam_submission_list with no parameters', () => {
    expect(es.display_exam_submission_list()).toBe("error null");
});
test('call display_exam_submission_list with incorrect token', () => {
    expect(es.display_exam_submission_list("dsdsdsdssdsd", "toreview")).toBe("error null");
});
test('call display_exam_submission_list with incorrect query param', () => {
    expect(es.display_exam_submission_list(mdb.active_users[3].token, "torevifew")).toBe("error null");
});
test('call display_exam_submission_list with correct values', () => {
    expect(es.display_exam_submission_list(mdb.active_users[0].token, "owned")).toEqual(mdb.exam_submissions);
});

//insert_exam_submission() tests
test('call insert_exam_submission with no parameters', () => {
    expect(es.insert_exam_submission()).toBe("error null");
});
test('call insert_exam_submission with incorrect token', () => {
    expect(es.insert_exam_submission("dsdsdsdssdsd", {"ref_exam": 0,"answers":["bob","booby"], "status": "on hold"})).toBe("error null");
});
test('call insert_exam_submission with incorrect payload', () => {
    expect(es.insert_exam_submission(mdb.active_users[2].token, {"ref_exam": 0,"answers":["bob","booby"], "status": 2})).toBe("error null");
});
test('call insert_exam_submission with correct values', () => {
    expect(es.insert_exam_submission(mdb.active_users[2].token,  {"ref_exam": 0,"answers":["bob","booby"], "status": "on hold"})).toEqual(1);
});
//exam_submission_peer_review_list() tests
test('call update_exam_submission with no parameters', () => {
    expect(es.update_exam_submission()).toBe("error null");
});
test('call update_exam_submission with incorrect token', () => {
    expect(es.update_exam_submission("dsdsdsdssdsd", {"ref_exam": 0,"answers":["bob","booby"], "status": "on hold"})).toBe("error null");
});
test('call update_exam_submission with incorrect payload', () => {
    expect(es.update_exam_submission(mdb.active_users[1].token, {"ref_exam": 0})).toBe("error null");
});
test('call update_exam_submission with correct values as submitter', () => {
    expect(es.update_exam_submission(mdb.active_users[1].token,  0, {"answers":["bob","booby"], "status": "completed"})).toEqual(0);
});
test('call update_exam_submission with correct values as owner of the exam', () => {
    expect(es.update_exam_submission(mdb.active_users[1].token,  0, {"evaluation": "good"})).toEqual(0);
});
//exam_submission_peer_review_list() tests
test('call exam_submission_peer_review_list with incorrect token', () => {
    expect(es.exam_submission_peer_review_list("dsdsdsdssdsd")).toBe("error null");
});
test('call exam_submission_peer_review_list with correct values as submitter', () => {
    expect(es.exam_submission_peer_review_list(mdb.active_users[1].token,  0)).toEqual([mdb.exam_peer_reviews[0]]);
});
test('call exam_submission_peer_review_list with correct values as submitter - 2', () => {
    expect(es.exam_submission_peer_review_list(mdb.active_users[2].token,  1)).toEqual([mdb.exam_peer_reviews[1]]);
});