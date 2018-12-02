
const mdb = require('../mdb/mdb.js');
const loginFunction = require('../routes/auth.js').loginFunction;

// POST /auth
test('POST /auth OK case correct email and pwd of registered unlogged user', () => {
    let email = 'billy@b';
    let pwd = 'pwd1';
    expect(loginFunction(email, pwd)).toBe(mdb.active_users.getTokenByUser(mdb.users.getUserByEmail(email))));
});
