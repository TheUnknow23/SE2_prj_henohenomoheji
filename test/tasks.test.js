const mdb = require ('../mdb/mdb.js');
const tasks = require('./../routes/tasks.js');

test('dummy test', () => {
    expect(3).toBe(3);
});

test('Get list of created tasks.', () => {
    let token = mdb.active_user[0].token;
    expect(tasks.getTaskslist(token, "all")).toBe(mdb.tasks);
    
});
