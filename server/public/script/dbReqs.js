const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url = "mongodb+srv://test_user:8xNezTy1dqlXDXzm@clustera-nj0as.gcp.mongodb.net/Pernoctario?retryWrites=true&w=majority";
const config = { useUnifiedTopology: true };

module.exports = {
  mongodb,
  MongoClient,
  url,
  config
}