const express = require('express');
const ajvClass = require('ajv');
const ajv = new ajvClass();
const router = express.Router();
const mdb = require('./../mdb/mdb.js');

const result400 = {status: 400, body: {code: 400, message: "Bad Request"}};
const result401 = {status: 401, body: {code: 401, message: "Unauthorized, missing or invalid API Key"}};
const result404 = {status: 404, body: {code: 404, message: "Not Found"}};
var examInputSchema = {"type": "object", "required": ["title", "description", "final_deadline", "reviews_deadline"], "properties": {"title": {"type": "string"}, "description": {"type": "string"}, "final_deadline": {"type": "string"}, "reviews_deadline": {"type": "string"}}};











/**
 *  controlla se selection contiene valore giusto
 * @param {type} selection
 * @returns {int} se ии valido ritorna 1 (created) o 2 (assingned), altrimenti 0
 */
function isValidselection(selection) {
        let valid = 0;
        if (selection === "created")
        {
                valid = 1;
        }
        if (selection === "assigned")
        {
                valid = 2;
        }
        return valid;
}



/**
 * get exam list
 * if user is teacher return all exam created by him
 * if user is student return all his assigned  exam
 * @param {type} token
 * @param {type} selection
 * @returns {getExamlist.result|nm$_exam_submission.getExamlist.result|nm$_exam_submission.result400|nm$_exam_submission.result401}
 */
function getExamlist(token, selection) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid selection value
        else if (isValidselection(selection) === 0)
        {

                result = result400;
        }
        else
        {

                let body;
                if (isValidselection(selection) === 1)
                {
                        body = mdb.exams.filterByOwner(user);
                }
                else if (isValidselection(selection) === 2)
                {
                        body = mdb.exams.filterByAssingned(user.id);
                }

                //se body ии un array vuoto, significa 404
                if (body.length === 0)
                {
                        result = result404;
                }
                else
                {
                        result = {};
                        result.status = 200;
                        result.body = body;
                }

        }

        return result;

}

/**
 * crea nuovo exam attraverso post
 * @param {type} token
 * @param {type} postBody
 * @returns {nm$_exams.result400|nm$_exams.postExam.result|postExam.result|nm$_exams.result401}
 */
function postExam(token, postBody) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        else
        {
                //validare gli attributi necessari
                let validate = ajv.compile(examInputSchema);
                //se non ии valido
                if (!validate(postBody))
                {
                        result = result400;
                }
                else
                {

                        /**
                         * da finire----------------------------------------------------------------------
                         */
                        let body = 1;

                        result = {};
                        result.status = 201;
                        result.body = body;
                }
        }

        return result;

}

/**
 * get a single exam
 * @param {type} token
 * @param {type} selection
 * @param {type} exam_id
 * @returns {nm$_exams.result400|nm$_exams.getExam.result|nm$_exams.result401|nm$_exams.result404|getExam.result}
 */
function getExam(token, selection, exam_id) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid selection value
        else if (isValidselection(selection) === 0)
        {

                result = result400;
        }
        else
        {

                /**
                 * da finire----------------------------------------------------------------------
                 */
                let body;
                if (isValidselection(selection) === 1)
                {
                        //body = mdb.exams.filterByOwner(user);
                }
                else if (isValidselection(selection) === 2)
                {
                        //body = mdb.exams.filterByAssingned(user.id);
                }

                //se body ии un array vuoto, significa 404
                if (body === undefined)
                {
                        result = result404;
                }
                else
                {
                        result = {};
                        result.status = 200;
                        result.body = body;
                }

        }

        return result;

}

/**
 * update un esame giид esistente
 * @param {type} token
 * @param {type} putBody
 * @param {type} exam_id
 * @returns {nm$_exams.putExam.result|nm$_exams.result401|putExam.result}
 */
function putExam(token, putBody, exam_id) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        else
        {

                /**
                 * da finire----------------------------------------------------------------------
                 */
                let body = 1;
                result = {};
                result.status = 201;
                result.body = body;

        }

        return result;

}



router.get('/', function (req, res) {

        //get parametri necessari
        let token = req.query.token;
        let selection = req.query.selection;
        //get lista di esame
        let result = getExamlist(token, selection);

        //set codice di stato e risultato
        res.status(result.status);
        res.json(result.body);


});

router.post('/', function (req, res) {

        //get parametri necessari
        let token = req.query.token;
        let postBody = req.body;
        let result = postExam(token, postBody);

        //set codice di stato e risultato
        res.status(result.status);
        res.json(result.body);


});

router.get('/:exam_id', function (req, res) {

        //get parametri necessari
        let exam_id = req.params["exam_id"];
        let token = req.query.token;
        let selection = req.query.selection;
        //get lista di esame
        let result = getExam(token, selection, exam_id);

        //set codice di stato e risultato
        res.status(result.status);
        res.json(result.body);


});


router.put('/:exam_id', function (req, res) {

        //get parametri necessari
        let exam_id = req.params["exam_id"];
        let token = req.query.token;
        let putBody = req.body;
        let result = putExam(token, putBody, exam_id);

        //set codice di stato e risultato
        res.status(result.status);
        res.json(result.body);


});




module.exports.router = router;
module.exports.result400 = result400;
module.exports.result401 = result401;
module.exports.result404 = result404;
module.exports.getExamlist = getExamlist;
module.exports.postExam = postExam;
module.exports.getExam = getExam;
module.exports.putExam = putExam;