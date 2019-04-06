const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'local';
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);

  const collection = db.collection('users');

  // collection.insert([{username: "Justin", password: "asflkjfe"}], function(err,result){
  //   console.log(result);

  //   console.log("\n");

  //   console.log("Inserted Document");
  // });

  var usern = "Jlkajsefln";
  var stuff = collection.find({username: usern}).toArray(function(err, docs){

    if(docs[0] == undefined)
    {
      //Not Found
      console.log("Not in Database");

    }
    else
    {
      //Found

      console.log("In database");
    }

  });

  client.close();
});