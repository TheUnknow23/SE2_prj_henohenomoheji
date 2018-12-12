
const mdb = require ('./../../mdb/mdb.js');
const errors = require('./../../schemas/errors/generic.json');

function logoutFunction(token) {
    const requester = mdb.active_users.getUserByToken(token);
    if(requester !== null){
        mdb.active_users.deleteByUser(requester);
        return {status: 200}
    }else{
        return {status: 401}
    }
}

module.exports.logoutFunction = logoutFunction;