const { MongoClient } = require('mongodb');
//const uri = 'mongodb://127.0.0.1:27017/GTFS';
const uri = 'mongodb://192.168.0.197:27017'
const mongo = new MongoClient(uri);

let connection = null;

module.exports.get = async () => {
    if(!connection) {
        connection = await mongo.connect();      
    } 
    return connection;
}