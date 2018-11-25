var Users = require('./classes/User'); var Tasks = require('./classes/Task');
var Groups = require('./classes/Group'); var Exams = require('./classes/Exam');
var Exam_Submissions = require('./classes/Exam_Submission');
var Exam_Peer_Reviews = require('./classes/Exam_Peer_Review');
var Active_Users = require('./classes/Active_Users');
var users = new Users(); var tasks = new Tasks(); var groups = new Groups();
var exams = new Exams(); var exam_submissions = new Exam_Submissions();
var exam_peer_reviews = new Exam_Peer_Reviews(); var active_users = new Active_Users();
//------------------------------------------


//default users | input schema: (name, surname, email, password, type)
users.add("gino", "giino", "gino@gino", "pwd1");users.add("geno", "genovese", "geno@geno", "pwd2");
users.add("gano", "gano", "gano@gsno", "pwd3");users.add("guno", "gunovese", "guno@geno", "pwd4");
//console.log("\x1b[36mUSERS _> \x1b[0m");//console.log("," + users);//console.log("\n###################\n");

//default tasks | input schema: (owner, task_type, subject, title, description, answer[], solution)
tasks.add(users[1], "multiple choice", "CS", "title1", "my top desc 1", ["opt1", "opt2", "opt3"], "opt3");
tasks.add(users[1], "multiple choice", "CS", "title2", "my top desc 2", ["opt1", "opt2", "opt3"], "opt1");
tasks.add(users[1], "text", "CS", "title3", "my top desc 3", undefined, "correct solution");
//console.log("\x1b[34mTASKS _> \x1b[0m");//console.log("," + tasks);//console.log("\n###################\n");

//default groups | input schema: (owner, name, description, members[])
groups.add(users[1], "group1", "desch1", [users[0], users[2]]);
groups.add(users[0], "group2", "desc2", [users[1], users[2], users[3]]);
//console.log("\x1b[32mGROUPS _> \x1b[0m");//console.log("," + groups);//console.log("\n###################\n");

//default exams | input schema: (owner, title, subject, description, taskset[], final_deadline, review_deadline)
exams.add(users[1], "cool title", "cool subject", "description", [tasks[1], tasks[2]], groups[0], "12/12/12 12:12", "12/12/12 12:21");
//console.log("\x1b[31mEXAMS _> \x1b[0m");//console.log("" + exams);//console.log("\n###################\n");

//default exam_submissions | input schema: (ref_exam, submitter, answer[], status)
exam_submissions.add(exams[0], users[0], ["opt3", "opt2"], "on hold");
//console.log("EXAM_SUBMISSIONS _>");//console.log(exam_submissions);//console.log("\n###################\n");

//default exam_peer_reviews | input schema: (group_member_of_exam, exam_submission, review[])
exam_peer_reviews.add(exams[0].group.getRandomMember(), exam_submissions[0], undefined);
//console.log("EXAM_PEER_REVIEWS _>");//console.log(exam_peer_reviews);//console.log("\n###################\n");
//login.get(/login)
email = "gino@gino"; password = "pwd1";
if(users.getUserByEmail(email).password === password){
    //console.log("LOGGED IN SUCCESSFULLY!");
    active_users.add(users.getUserByEmail(email));
    console.log("token is " + active_users[0].token);
}
//console.log("ACTIVE_USERS _>");//console.log(active_users);//console.log("\n###################\n");

//------------------------------------------
module.exports.users = users; module.exports.tasks = tasks; module.exports.groups = groups;
module.exports.exams = exams; module.exports.exam_submissions = exam_submissions;
module.exports.exam_peer_reviews = exam_peer_reviews; module.exports.active_users = active_users;