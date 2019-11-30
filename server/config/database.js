const mongoose = require("mongoose");
const db = mongoose.connection;

function init() {
  //mongoose.connect("mongodb://127.0.0.1:27017/employee");
  mongoose.connect('mongodb://Elaine:039982@cluster0-shard-00-00-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-01-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-02-qm0uv.gcp.mongodb.net:27017/2ndProject1?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');

}

db.once("open", function() {
  console.log("mongodb connected.");
});

module.exports = init;
/*
/*
let p = Mongoose.connect('mongodb://Elaine:039982@cluster0-shard-00-00-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-01-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-02-qm0uv.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
p.catch(err => console.log('in error callback', err));
p.then(console.log('db connected'));
*/