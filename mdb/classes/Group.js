class Group{
    /* 
    id(integer) PRIMARY KEY
    owner(User) FOREIGN KEY
    name(string) UNIQUE
    description(string)
    members(User[]) "MULTIPLE" FOREIGN KEY
    */
    constructor(id, owner, name, description, members){
        this.id = id; this.owner = owner; this.name = name; this.description = description; this.members = members;
    }
    update(name, description, members){
        (name !== "" || name !== undefined) ? this.name = name : console.log("T_T");
        (description !== "" || description !== undefined) ? this.description = description : console.log("T_T"); 
        (members !== "" || members !== undefined) ? this.members = members : console.log("T_T"); 
    }
    getRandomMember(){
        return this.members[Math.floor(Math.random()*this.members.length)];
    }
    toString(){
        return "\x1b[32mID : " + this.id + "\x1b[0m\nOWNER -> " + this.owner + "NAME : " + this.name +
               ", DESCRIPTION : " + this.description + "\nMEMBERS -> " + this.members;
    }
}
class Groups extends Array{
    //ADD METHOD
    add(owner, name, description, members){
        var x = null;
        if(this.length === 0){
            x = new Group(0, owner, name, description, members);
        }else{
            if(this.find(obj => obj.name === name) === undefined){
                x = new Group(this[this.length-1].id+1, owner, name, description, members);
            }
        }
        if(x !== null){
            this.push(x);
        }
        console.log("Groups length : " + this.length);
    }
    //FIND METHODS
    findById(id){
        return this.find(obj => obj.id === id);
    }
    findByName(name){
        return this.find(obj => obj.name === name);
    }
    //FILTER METHODS
    filterByOwner(owner){
        return this.filter(obj => obj.owner.email === owner.email);
    }
    //GET METHODS
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    //DELETE METHODS
    deleteByName(name){
        var id = this.indexOf(this.find(obj => obj.name === name));
        if(id>=0){
            this.splice(id,1);
        }
    }
}
module.exports = Groups;