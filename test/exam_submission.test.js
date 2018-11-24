const es = require('./../routes/exam_submission');
const des = require('./../routes/exam_submission').display_exam_submission;
test('dummy test', () => {
    expect(3).toBe(3);
});
test('call display_exam_submission with no paramaters', () => {
    expect(des()).toBe(null);
});
