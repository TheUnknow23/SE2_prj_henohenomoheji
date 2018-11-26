function makeid(len) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++)
        {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
}
class Active_User {
        /*
         token(string) PRIMARY KEY
         user(User) UNIQUE
         */
        constructor(user) {
                this.token = makeid(8);
                this.user = user;
        }
}
class Active_Users extends Array {
        //ADD METHOD
        add(user) {
                console.log("got user -> " + user);
                var x = null;
                if (this.length === 0)
                {
                        x = new Active_User(user);
                }
                else
                {
                        if (this.find(obj => obj.user.email === user.email) === undefined)
                        {
                                x = new Active_User(user);
                        }
                }
                if (x !== null)
                {
                        this.push(x);
                        //se ии stato inserito corettamente ritorna token
                        return x.token;
                }
                console.log("Active users length : " + this.length);
                //se non ии stato inserito ritorna null
                return null;
        }
        //GET METHODS
        getTokenByUser(user) {

                let userFound = this.find(obj => obj.user.email === user.email);
                if (userFound !== undefined)
                {
                        return this[this.indexOf(userFound)].token;
                }
                else
                {
                        return null;
                }

        }
        getUserByToken(token) {

                let tokenFound = this.find(obj => obj.token === token);
                if (tokenFound !== undefined)
                {
                        return this[this.indexOf(tokenFound)].user;
                }
                else
                {
                        return null;
                }


        }
        //DELETE METHODS
        deleteByUser(user) {
                var index = this.indexOf(this.find(obj => obj.user.email === user.email));
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
module.exports = Active_Users;
