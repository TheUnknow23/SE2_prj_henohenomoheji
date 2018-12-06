const mdb = require('./../mdb');
class Task{
    /* 
    id(integer) PRIMARY KEY
    owner(User) FOREIGN KEY
    task_type(string)
    subject(string)
    title(string)
    description(string)
    answer(string[]) DEFAULT NULL
    solutions(string[]) 
    */
    constructor(id, owner, task_type, subject, title, description, answer, solutions){
        this.id = id; this.owner = owner; this.task_type = task_type; this.subject = subject; 
        this.title = title; this.description = description; this.answer = answer; this.solutions = solutions;
    }
    update(task_type, subject, title, description, answer, solutions){
        if(task_type !== "" && task_type !== undefined) this.task_type = task_type;
        if(subject !== "" && subject !== undefined) this.subject = subject; 
        if(title !== "" && title !== undefined) this.title = title;
        if(answer !== "" && answer !== undefined) this.answer = answer; 
        if(solutions !== "" && solutions !== undefined) this.solutions = solutions; 
        if(description !== "" && description !== undefined){
            this.description = description;
            mdb.exams.updateTask(this);
        }
        return this;
    }
}
class Tasks extends Array{
    //ADD METHOD
    add(owner, task_type, subject, title, description, answer, solutions){
        var x = null;
        if(this.length === 0){
            x = new Task(0, owner, task_type, subject, title, description, answer, solutions);
        }else{
            x = new Task(this[this.length-1].id+1, owner, task_type, subject, title, description, answer, solutions);
        }
        if(x !== null){
            this.push(x);
        }
        return this[this.length-1];
    }
    //FILTER METHODS
    filterByOwner(owner){
        return this.filter(obj => obj.owner.email === owner.email);
    }
    filterBySubject(subject){
        return this.filter(obj => obj.subject === subject);
    }
    //GET METHODS
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    getTaskById(id){
        return this.find(obj => obj.id === id);
    }
    //DELETE METHODS
    deleteById(id){
        var index = this.indexOf(this.find(obj => obj.id === id));
        if(index>=0){
            this.splice(index,1);
        }
    }
    //UPDATE METHODS
    updateUser(user){
        for(let i = 0; i < this.length; i++){
            if(this[i].owner.id === user.id){
                this[i].owner.email = user.email;
            }
        }
    }
}
module.exports = Tasks;