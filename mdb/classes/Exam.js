class Exam {
        /* 
         id(integer) PRIMARY KEY
         owner(User) FOREIGN KEY
         title(string)
         subject(string)
         description(string)
         taskset(Task[]) "MULTIPLE" FOREIGN KEY
         group(Group) FOREIGN KEY
         final_deadline(timestamp)
         review_deadline(timestamp)
         */
        constructor(id, owner, title, subject, description, taskset, group, final_deadline, review_deadline) {
                this.id = id;
                this.owner = owner;
                this.title = title;
                this.subject = subject;
                this.description = description;
                this.taskset = taskset;
                this.group = group;
                this.final_deadline = final_deadline;
                this.review_deadline = review_deadline;
        }
        update(title, subject, description, taskset, group, final_deadline, review_deadline) {
                (title !== "" || title !== undefined) ? this.title = title : console.log("T_T");
                (subject !== "" || subject !== undefined) ? this.subject = subject : console.log("T_T");
                (description !== "" || description !== undefined) ? this.description = description : console.log("T_T");
                (taskset !== "" || taskset !== undefined) ? this.taskset = taskset : console.log("T_T");
                (group !== "" || group !== undefined) ? this.group = group : console.log("T_T");
                (final_deadline !== "" || final_deadline !== undefined) ? this.final_deadline = final_deadline : console.log("T_T");
                (review_deadline !== "" || review_deadline !== undefined) ? this.review_deadline = review_deadline : console.log("T_T");
        }
        toString() {
                return "\x1b[31mID : " + this.id + "\x1b[0m\nOWNER -> " + this.owner + "TITLE : " + this.title +
                        ", SUBJECT : " + this.subject + ", DESCRIPTION : " + this.description + "\n\nTASK SET -> \n" + this.taskset +
                        "\nGROUP -> " + this.group + "\nFINAL_DEADLINE : " + this.final_deadline + ", REVIEW_DEADLINE : " + this.review_deadline;
        }
}
class Exams extends Array {
        //ADD METHOD
        add(owner, title, subject, description, taskset, group, final_deadline, review_deadline) {
                var x = null;
                if (this.length === 0)
                {
                        x = new Exam(0, owner, title, subject, description, taskset, group, final_deadline, review_deadline);
                }
                else
                {
                        x = new Exam(this[this.length - 1].id + 1, owner, title, subject, description, taskset, group, final_deadline, review_deadline);
                }
                if (x !== null)
                {
                        this.push(x);
                }
                console.log("Exams length : " + this.length);
        }
        //FILTER METHODS
        filterByOwner(owner) {
                return this.filter(obj => obj.owner.email === owner.email);
        }
        filterByTitle(title) {
                return this.filter(obj => obj.title === title);
        }
        //get all assingned exams by user id
        filterByAssingned(user_id) {
                //check su ogni esame
                let arrayOfExam = this.filter(function (singleExam) {
                        let exist = false;
                        //se utente attuale appartiene a gruppo di quella esame
                        for (let j = 0; j < singleExam.group.members.length; j++)
                        {
                                if (singleExam.group.members[j].id === user_id)
                                {
                                        exist = true;
                                }
                        }
                        return exist;

                });


                //eliminare gli attributi inutili di task
                for (let i = 0; i < arrayOfExam.length; i++)
                {
                        for (let j = 0; j < arrayOfExam[i].taskset.length; j++)
                        {
                                arrayOfExam[i].taskset[j].owner = "";
                                arrayOfExam[i].taskset[j].solutions = "";
                                
                        }
                }

                return arrayOfExam;
        }

        //GET METHODS
        getIndexById(id)
        {
                return this.indexOf(this.find(obj => obj.id === id));
        }
        getExamById(id)
        {
                return this.find(obj => obj.id === id);
        }
        //DELETE METHODS
        deleteByTitleAndOwner(title, owner) {
                var index = this.indexOf(this.find(obj => (obj.title === title && obj.owner === owner)));
                if (index >= 0)
                {
                        this.splice(index, 1);
                }
        }
        deleteById(id) {
                var index = this.indexOf(this.find(obj => obj.id === id));
                if (index >= 0)
                {
                        this.splice(index, 1);
                }
        }
}
module.exports = Exams;