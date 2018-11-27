
const routerGetUsers = require('../routes/users.js').routerGetUsers;
const routerGetUserById = require('../routes/users.js').routerGetUserById;
const mdb = require('../mdb/mdb.js');

test('GET /users with requester != requested', () => {
    let user = routerGetUserById(mdb.active_users.getTokenByUserId(0), 1);
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.surname).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password).toBeUndefined();
});
