const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";
const config = { useUnifiedTopology: true };

module.exports = {
  mongodb,
  MongoClient,
  url,
  config
}