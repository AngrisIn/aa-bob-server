const mongoose = require("mongoose")
const config = require("./config");

const MongoURI = config.db_url;
class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(MongoURI)
        .then(() => {
            console.log("Database Connection Successful!");
        })
        .catch((err) => {
            console.log("Database Connection Failed!" + err);
        })
    }
}

module.exports = new Database();