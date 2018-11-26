const express = require('express');
const router = express.Router();
const mdb = require ('./../mdb/mdb.js');

/*##### FUNCTION SECTION #####*/

// GET on /groups
function routerGetGroups(token){
        let requester = mdb.active_users.getUserByToken(token);
        if (requester !== null && requester.type === 'teacher'){
                let groups = mdb.groups.getAll();
        }
}

router.get('/', function(req, res) {
        res.send('groups resources');
});

module.exports = router;
