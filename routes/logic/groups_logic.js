const Ajv = require ('ajv');
const ajv = new Ajv();
const mdb = require ('./../../mdb/mdb.js');
const postSchema = require('../../schemas/payloads/group_post_schema.json');
const putSchema = require('./../../schemas/payloads/groups_put_schema.json');

/*##### FUNCTION SECTION #####*/

// GET on /groups
/**
 *  GET on /groups. This functions returns a list of all the groups if the user is logged, error otherwise
 * @param {string}token used to identify the logged user
 * @returns {*}
 */
function getGroups(token){
    const requester = mdb.active_users.getUserByToken(token);
    if (requester !== null /*&& (requester.type === 'teacher' || requester.type === 'student')*/){
        return mdb.groups.getAll();
    } else {
        return '401 Requester not logged or not authorized'
    }
}

// GET on /groups/:group_id
/**
 *  GET on /groups/:group_id. Returns a specific group object if the user is logged and the specified id exist, error otherwise
 * @param {string}token used to identify the logged user
 * @param {number}id used to identify a specific group
 * @returns {*}
 */
function getGroup(token, id){
    let requester = mdb.active_users.getUserByToken(token);
    if (requester !== null /*&& (requester.type === 'teacher' || requester.type === 'student')*/){
        let group = mdb.groups.getGroupById(id);
        if (group !== null&&group !==undefined){
            return group;
        } else {
            return 'The specified resource doesn\'t exist'
        }
    } else {
        return '401 Requester not logged or not authorized'
    }
}

// POST on /groups
/**
 *  POST on /groups. Allows the user to create a group. Returns 201 if the operation is successful, 401 if the user is not logged,
 *  400 if there is an error in the body
 * @param {JSON}body of the request
 * @return {number}
 */
function createGroup(body, token){
    //console.log(body);
    if(ajv.validate(postSchema, body)) {
        if (mdb.active_users.getUserByToken(token)!==null && mdb.active_users.getUserByToken(token)!==undefined) {
            if (mdb.groups.add({
                "id": mdb.active_users.getUserByToken(token).id,
                "email": mdb.active_users.getUserByToken(token).email
            }, body.name, body.description, body.members_id)) {
                return 201;
            } else {
                return 400;
            }
        } else {
            return 401;
        }
    } else {
        return 400;
    }
}

// PUT on /groups/:group_id
/**
 *  PUT on /groups/:group_id. Allows the owner of a specific group to update the group's properties
 * @param {number}id of the single group
 * @param {JSON}body of the request
 * @returns {*}
 */
function updateGroup(id, body, token){
    //console.log("update "+body.members);
    if (ajv.validate(putSchema, body)){
        //console.log("ValidJson")
        if (mdb.groups.getGroupById(id)!==null && mdb.groups.getGroupById(id)!==undefined) {
            if (mdb.active_users.getUserByToken(token)!==null && mdb.active_users.getUserByToken(token)!==undefined) {
                if (mdb.active_users.getUserByToken(token).id === mdb.groups.getGroupById(id).owner.id) {
                    return mdb.groups.updateById(id, body.name, body.description, body.members_id);
                } else {
                    return 403;
                }
            } else {
                return 401;
            }
        } else {
            return 'The specified id does not exist';
        }
    }
    return 400;
}

module.exports.getGroups = getGroups;
module.exports.getGroup = getGroup;
module.exports.createGroup = createGroup;
module.exports.updateGroup = updateGroup;