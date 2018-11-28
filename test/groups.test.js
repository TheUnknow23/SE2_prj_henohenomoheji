const groups = require('./../routes/groups.js');
const mdb = require('./../mdb/mdb.js');

test('dummy test', () => {
    console.log("Dummy test");
    expect(3).toBe(3);
});

// getGroups testing
test('call getGroups as not logged user', ()=>{
    expect(groups.getGroups()).toBe('Requester not logged or not authorized');
});
test('call getGroups as logged user', ()=>{
    expect(groups.getGroups(mdb.active_users[0].token)).toBe(mdb.groups);
});

// getGroup testing
test('call getGroup as not logged user, no id', ()=>{
    expect(groups.getGroup()).toBe('Requester not logged or not authorized');
});
test('call getGroup as logged user, wrong id', ()=>{
    expect(groups.getGroup(mdb.active_users[0].token, 9057)).toBe('The specified resource doesn\'t exist');
});
test('call getGroup as logged user, correct id', ()=>{
    expect(groups.getGroup(mdb.active_users[0].token, 0)).toBe(mdb.groups[0]);
});
test('call getGroup wrong token, correct id', ()=>{
    expect(groups.getGroup('cnjcd34J', 0)).toBe('Requester not logged or not authorized');
});
test('call getGroup wrong token, wrong id', ()=>{
    expect(groups.getGroup('hjdfh78s', 9075)).toBe('Requester not logged or not authorized');
});

// createGroup testing
test('call createGroup wrong payload', ()=>{
    expect(groups.createGroup({"name": "hfsb", "description": "hfjdi"})).toBe(400);
});
test('call createGroup correct payload', ()=>{
    expect(groups.createGroup({"token": mdb.active_users[0].token, "name": "hfsb", "description": "hfjdi", "members_id": mdb.groups[0].getMembersId()})).toBe(201);
});

// updateGroup testing
test('call updateGroup wrong id, wrong payload', ()=>{
    expect(groups.updateGroup(987, {"nkme":545})).toBe(400);
});
test('call updateGroup correct id, wrong payload', ()=>{
    expect(groups.updateGroup(0, {"nome":545, "desh":"string", "members": ["test", "error"]})).toBe(400);
});
test('call updateGroup correct id, correct payload', ()=>{
    expect(groups.updateGroup(0, {"name":"hgh", "description": "hfjvbj"})).toBe(200);
});
test('call updateGroup wrong id, correct payload', ()=>{
    expect(groups.updateGroup(689, {"name":"hgh", "description": "hfjvbj"})).toBe(400);
});