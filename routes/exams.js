const express = require('express');
const ajvClass = require('ajv');
const ajv = new ajvClass();
const router = express.Router();
const mdb = require('./../mdb/mdb.js');
const result400 = {status: 400, body: {code: 400, message: "Bad Request"}};
const result401 = {status: 401, body: {code: 401, message: "Unauthorized, missing or invalid API Key"}};
const result404 = {status: 404, body: {code: 404, message: "Not Found"}};
var examInputSchema = {"type": "object", "required": ["title", "description", "group_id", "final_deadline", "review_deadline"], "properties": {"title": {"type": "string"}, "description": {"type": "string"}, "group_id": {"type": "string"}, "final_deadline": {"type": "string"}, "review_deadline": {"type": "string"}}};
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
 * controlla se input di post sia campo vuoto
 * @param {type} body
 * @returns {isEmptyOnPostInput.empty|Boolean}
 */
function isEmptyOnPostInput(body) {
        let empty = false;
        if (body.title === "" || body.description === "" || body.final_deadline === "" || body.review_deadline === "")
        {
                empty = true;
        }
        return empty;
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
                        body = mdb.exams.filterByOwner(user.id);
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
                if (!validate(postBody) || isEmptyOnPostInput(postBody))
                {
                        result = result400;
                }
                else
                {

                        //get parametri
                        let title = postBody.title;
                        let description = postBody.description;
                        //get array di taskInExam
                        let tasks_ids = postBody.tasks_ids;
                        let taskset = [];
                        if (tasks_ids !== "")
                        {
                                for (let i = 0; i < tasks_ids.length; i++)
                                {
                                        let singleTask = mdb.tasks.getTaskById(parseInt(tasks_ids[i]));
                                        if (singleTask !== undefined)
                                        {
                                                taskset.push({"task_id": singleTask.id, "description": singleTask.description});
                                        }

                                }
                        }
                        //get gruppo
                        let group_id = postBody.group_id;
                        let group;
                        if (group_id !== "")
                        {
                                group = mdb.groups.getGroupById(parseInt(group_id));
                        }
                        //get parametri
                        let final_deadline = postBody.final_deadline;
                        let review_deadline = postBody.review_deadline;
                        //insesce nella tabella
                        let body = mdb.exams.add(user.id, title, description, taskset, group, final_deadline, review_deadline);
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
 * @param {type} exam_id
 * @returns {nm$_exams.result400|nm$_exams.getExam.result|nm$_exams.result401|nm$_exams.result404|getExam.result}
 */
function getExam(token, exam_id) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid id
        else if (exam_id === undefined || isNaN(parseInt(exam_id)))
        {

                result = result400;
        }
        else
        {

                let body = mdb.exams.getExamById(parseInt(exam_id));
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
        //if isn't valid id
        else if (exam_id === undefined || isNaN(parseInt(exam_id)))
        {

                result = result400;
        }
        //se non esiste esame con tale id
        else if (mdb.exams.getExamById(parseInt(exam_id)) === undefined)
        {

                result = result404;
        }
        else
        {

                //validare gli attributi necessari
                let validate = ajv.compile(examInputSchema);
                //se non ии valido
                if (!validate(putBody))
                {
                        result = result400;
                }




                //get parametri
                let title = putBody.title;
                let description = putBody.description;
                //get array di taskInExam
                let tasks_ids = putBody.tasks_ids;
                let taskset = [];
                if (tasks_ids !== "")
                {
                        for (let i = 0; i < tasks_ids.length; i++)
                        {
                                let singleTask = mdb.tasks.getTaskById(parseInt(tasks_ids[i]));
                                if (singleTask !== undefined)
                                {
                                        taskset.push({"task_id": singleTask.id, "description": singleTask.description});
                                }

                        }
                }
                //get gruppo
                let group_id = putBody.group_id;
                let group;
                if (group_id !== "")
                {
                        group = mdb.groups.getGroupById(parseInt(group_id));
                }
                //get parametri
                let final_deadline = putBody.final_deadline;
                let review_deadline = putBody.review_deadline;
                //insesce nella tabella
                mdb.exams[exam_id].update(title, description, taskset, group, final_deadline, review_deadline);
                result = {};
                result.status = 200;
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
router.get('/:id', function (req, res) {

        //get parametri necessari
        let id = req.params["id"];
        let token = req.query.token;
        //get lista di esame
        let result = getExam(token, id);
        //set codice di stato e risultato
        res.status(result.status);
        res.json(result.body);
});

router.put('/:id', function (req, res) {

        //get parametri necessari
        let id = req.params["id"];
        let token = req.query.token;
        let putBody = req.body;
        let result = putExam(token, putBody, id);
        //set codice di stato 
        res.sendStatus(result.status);
});

module.exports.router = router;
module.exports.result400 = result400;
module.exports.result401 = result401;
module.exports.result404 = result404;
module.exports.getExamlist = getExamlist;
module.exports.postExam = postExam;
module.exports.getExam = getExam;
module.exports.putExam = putExam;