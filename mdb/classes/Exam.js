const mdb = require('./../mdb');
class Exam {
        /* 
         id(integer) PRIMARY KEY
         owner({id, email}) FOREIGN KEY
         title(string)
         description(string)
         taskset(taskInExam[]) "MULTIPLE" FOREIGN KEY
         group(Group) FOREIGN KEY
         final_deadline(timestamp)
         review_deadline(timestamp)
         */
        constructor(id, owner, title, description, taskset, group, final_deadline, review_deadline) {
                this.id = id;
                this.owner = owner;
                this.title = title;
                this.description = description;
                this.taskset = taskset;
                this.group = group;
                this.final_deadline = final_deadline;
                this.review_deadline = review_deadline;
        }
        update(title, description, taskset, group, final_deadline, review_deadline) {
                (title !== "" && title !== undefined) ? this.title = title : console.log("T_T");
                (description !== "" && description !== undefined) ? this.description = description : console.log("T_T");
                (taskset !== "" && taskset !== undefined) ? this.taskset = taskset : console.log("T_T");
                (group !== "" && group !== undefined) ? this.group = group : console.log("T_T");
                (final_deadline !== "" && final_deadline !== undefined) ? this.final_deadline = final_deadline : console.log("T_T");
                (review_deadline !== "" && review_deadline !== undefined) ? this.review_deadline = review_deadline : console.log("T_T");
                mdb.exam_submissions.updateRef_Exam(this);
        }
        toString() {
                return "\x1b[31mID : " + this.id + "\x1b[0m\nOWNER -> " + this.owner + "TITLE : " + this.title + ", DESCRIPTION : " + this.description + "\n\nTASK SET -> \n" + JSON.stringify(this.taskset) +
                        "\nGROUP -> " + this.group + "\nFINAL_DEADLINE : " + this.final_deadline + ", REVIEW_DEADLINE : " + this.review_deadline;
        }
}
class Exams extends Array {
        //ADD METHOD
        add(owner, title, description, taskset, group, final_deadline, review_deadline) {
                var x = null;
                if (this.length === 0)
                {
                        x = new Exam(0, owner, title, description, taskset, group, final_deadline, review_deadline);
                }
                else
                {
                        x = new Exam(this[this.length - 1].id + 1, owner, title, description, taskset, group, final_deadline, review_deadline);
                }
                if (x !== null)
                {
                        this.push(x);
                }
                //console.log("Exams add : " + x.toString());
                //console.log("last exams id : " + this[this.length - 1].id);
                return this[this.length - 1].id;

        }
        //FILTER METHODS
        filterByOwner(owner) {
                return this.filter(obj => obj.owner.id === owner.id);
        }
        filterByTitle(title) {
                return this.filter(obj => obj.title === title);
        }
        //get all assingned exams by user id
        filterByAssingned(owner) {
            //check su ogni esame
            let arrayOfExam = this.filter(function (singleExam) {
                let exist = false;

                //se esame ha uno gruppo e tale gruppo non ���� vuoto
                if (singleExam.group !== undefined && singleExam.group.members !== undefined) {
                    for (let j = 0; j < singleExam.group.members.length; j++) {
                        //se utente attuale appartiene a gruppo di quella esame
                        if (singleExam.group.members[j].id === owner.id) {
                            exist = true;
                        }
                    }
                }
                return exist;
            });
            return arrayOfExam;
        }

        filterByAssignedId(assignedId) {
            let exams = [];
            let currentExam;
            let endInnerCycle = false;
            //Take an exam
            for (let i = 0; i < this.length; i++) {
                currentExam = this[i];
                //Cycle through all members of group to which exam was assigned
                for (let j = 0; j < currentExam.group.members.length && endInnerCycle === false; j++) {
                    if (currentExam.group.members[j].id === assignedId) {
                        exams.push(currentExam);
                        endInnerCycle = true;
                    }
                }
            }
            let retExams
            return retExams = JSON.parse(JSON.stringify(exams));
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