const mongoose = require('mongoose');

class Database {
    
    constructor() {
        this.connet();
    }


    connet() {
        mongoose.connect("mongodb+srv://admin:admin@twitterclonecluster.avtab3n.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority")
        .then(() => {
            console.log("succesful connection to db");
        })
        .catch((err) => {
            console.log("faild connection to db" + err);
        })
    }
}

module.exports = new Database();