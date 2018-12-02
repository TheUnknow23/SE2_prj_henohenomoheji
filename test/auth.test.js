
const mdb = require('../mdb/mdb.js');
const loginFunction = require('../routes/auth.js').loginFunction;

// POST /auth
test('POST /auth OK case correct email and pwd of registered unlogged user', () => {
    let email = 'billy@b';
    let pwd = 'pwd1';
    expect(loginFunction(email, pwd)).toBe(mdb.active_users.getTokenByUser(mdb.users.getUserByEmail(email)));
});

test('POST /auth NOT OK case correct email and pwd of registered _logged_ user', () => {
    let email = 'gino@gino';
    let pwd = 'pwd1';
    expect(loginFunction(email, pwd)).toBe('some error occurred');
});

test('POST /auth NOT OK case incorrect email (unregistered, mistyped)', () => {
    let email = 'gislno@gino';
    let pwd = 'pwd1';
    expect(loginFunction(email, pwd)).toBe('login failed');
});

test('POST /auth NOT OK case correct email but incorrect password (empty, mistyped)', () => {
    let email = 'gino@gino';
    let pwd = 'pwd30';
    expect(loginFunction(email, pwd)).toBe('incorrect password');
});

test('POST /auth NOT OK case email parameter empty, any password', () => {
    let email = '';
    let pwd = 'pwd30';
    expect(loginFunction(email, pwd)).toBe('login failed');
});

test('POST /auth NOT OK case correct email but null password', () => {
    let email = 'gino@gino';
    let pwd = null;
    expect(loginFunction(email, pwd)).toBe('incorrect password');
});

test('POST /auth NOT OK case correct email but undefined password', () => {
    let email = 'gino@gino';
    let pwd;
    expect(loginFunction(email, pwd)).toBe('incorrect password');
});

test('POST /auth NOT OK case null email, whatever password', () => {
    let email = null;
    let pwd = 'bana';
    expect(loginFunction(email, pwd)).toBe('login failed');
});

test('POST /auth NOT OK case undefined email, whatever password', () => {
    let email;
    let pwd = 'nana'
    expect(loginFunction(email, pwd)).toBe('login failed');
});