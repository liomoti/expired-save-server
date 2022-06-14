 let User = class{
    constructor(username,exsist){
        this.username = username;
        this.exsist = exsist;
    }
    getUserNmae(){
        return this.username;
    }
    getExsise(){
        return this.exsist;
    }
}
module.exports = User;
  