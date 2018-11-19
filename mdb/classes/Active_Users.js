function makeid(len) {
    var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
class Active_User{
    /*
    token(string) PRIMARY KEY
    user(User) UNIQUE
    */
    constructor(user){
        this.token = makeid(8);
        this.user = user;
    }
}
class Active_Users extends Array{
    //ADD METHOD
    add(user){
        var x = null;
        if(this.length === 0){
            x = new Active_User(user);
        }else{
            if(this.find(obj => obj.user.email === user.email) === undefined){
                x = new Active_User(user);
            }
        }
        if(x !== null){
            this.push(x);
        }
        console.log("Active users length : " + this.length);
    }
    //GET METHODS
    getTokenByUser(user){
        return this[this.indexOf(this.find(obj => obj.user.email === user.email))].token;
    }
    //DELETE METHODS
    deleteByUser(user){
        var id = this.indexOf(this.find(obj => obj.user.email === user.email));
        if(id>=0){
            this.splice(id,1);
        }
    }
}
module.exports = Active_Users;