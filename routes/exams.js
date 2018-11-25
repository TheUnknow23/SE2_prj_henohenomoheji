const express = require('express');
const router = express.Router();
const mdb = require('./../mdb/mdb.js');

const result400 = {status: 400, body: {code: 400, message: "Bad Request"}};
const result401 = {status: 401, body: {code: 401, message: "Unauthorized, missing or invalid API Key"}};
const result404 = {status: 404, body: {code: 404, message: "Not Found"}};












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

        res.json({hallo: "hallo"});
       
        
});





module.exports.router = router;
