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
    expect(es.display_exam_submission(mdb.active_users[2].token, 0)).toBe(mdb.exam_submissions[0]);
});
//display_exam_submission_list() tests
test('call display_exam_submission_list with no parameters', () => {
    expect(es.display_exam_submission_list()).toBe("error null");
});