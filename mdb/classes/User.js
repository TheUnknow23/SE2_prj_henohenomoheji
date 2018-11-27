class User{
    /*
    id(integer) PRIMARY KEY
    name(string)
    surname(string)
    email(string) UNIQUE
    password(string)
    */
    constructor(id, name, surname, email, password){
        this.id = id;this.name = name; this.surname = surname; 
        this.email = email; this.password = password;
    }
    update(name, surname, email, password){
        (name !== "" || name !== undefined) ? this.name = name : console.log("T_T"); 
        (surname !== "" || surname !== undefined) ? this.surname = surname : console.log("T_T");
        (email !== "" || email !== undefined) ? this.email = email : console.log("T_T"); 
        (password !== "" || password !== undefined) ? this.password = password : console.log("T_T"); 
    }
    toString(){
        return "\x1b[36m ID : " + this.id + "\x1b[0m (NAME : " + this.name + ", SURNAME : " + this.surname + 
        ", EMAIL : " + this.email + ", PWD : " + this.password +")\n";
    }
}
class Users extends Array{
    //ADD METHOD
    add(name, surname, email, password){
        var x = null;
        if(this.length === 0){
            x = new User(0, name, surname, email, password);
        }else{
            if(this.find(obj => obj.email === email) === undefined){
                x = new User(this[this.length-1].id+1, name, surname, email, password);
            }
        }
        if(x !== null){
            this.push(x);
        }
        //console.log("last user id : " + this[this.length-1].id);
        return this[this.length-1].id;
    }
    //FILTER METHODS
    filterByName(name){
        return this.filter(obj => obj.name === name);
    }
    //GET METHODS
    getIndexByEmail(email){
        return this.indexOf(this.find(obj => obj.email === email));
    }
    getUserByEmail(email){
        return this.find(obj => obj.email === email);
    }
    getUserById(id){
        return this.filter(obj => obj.id === id);
    }
    //DELETE METHODS
    deleteByEmail(email){
        var index = this.indexOf(this.find(obj => obj.email === email));
        if(index>=0){
            this.splice(index,1);
        }
    }
    deleteById(id){
        var index = this.indexOf(this.find(obj => obj.id === id));
        if(index>=0){
            this.splice(index,1);
        }
    }
}
module.exports = Users;