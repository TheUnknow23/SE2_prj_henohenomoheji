const mdb = require ('./../../mdb/mdb');
const errors = require('./../../schemas/errors/generic.json');
const Ajv = require('ajv');
var ajv = new Ajv();

function insert_exam_peer_review(token, exam_review){
    return {"status" : 202, "body": 0};
}

module.exports.insert_exam_peer_review = insert_exam_peer_review;