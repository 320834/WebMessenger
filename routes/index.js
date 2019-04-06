var express = require('express');
var router = express.Router();
var app = require('../app');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'local';
 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Messenger 信使"});
});

router.get('/register', function(req,res,next){
  res.render('register');
});

router.get('/login', function(req,res,next){
  res.render('login');
});

router.post('/loginUser', function(req,res,next){

  var user = req.body.username;
  var pass = req.body.password;

  //console.log(user + " " + pass);

  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    //console.log("Connected successfully to server");
 
    const db = client.db(dbName);
    const collection = db.collection('users');

    

    collection.find({username: user}).toArray(function(err,docs){
      console.log(docs[0]);
      if(docs[0] == undefined)
      {
        res.render('loginUser', {content: "Username cannot be found. 找不到账号"});
      }
      else
      {
        if(pass == docs[0].password)
        {
         
          res.render('sucessfulLogin', {username: user});
        }
        else
        {
          res.render('loginUser', {content: "Incorrect Password. 密码打错了"});
        }
      }
    });
    
  });

 
});

router.post('/registerUser', function(req,res,next){

  var strRes;

  console.log(req.body.username);
  MongoClient.connect(url, function(err, client){

    assert.equal(null, err);
    console.log("Connected successfully to server");
 
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.find({username: req.body.username}).toArray(function(err, docs){

      if(docs[0] == undefined)
      {
        //Not Found

        //Put in database

        collection.insert([{username: req.body.username, password: req.body.password}], function(err, result){
          assert.equal(err,null);
          
        });


        strRes = "You successfully registered " + req.body.username + "\n成功注册" + req.body.username;
        res.render('registerResult', {result: strRes});
      }
      else
      {
        //Found
  
        console.log("In database");
        strRes = req.body.username + " has already been taken. Please register with an different name. " + req.body.username + "账号已经注册了，请用另外账号来注册";
        res.render('registerResult', {result: strRes});
      }
  
    });
  });

  
  
});


// router.post('/submit', function(req, res, next){
//   console.log(req.body.userName);

//   var letters = req.body.userName;

//   var output = jre.spawnSync(["Java"], "WordFinder", [letters], {encoding: 'utf-8'}).output[1];

//   res.render('hello', {name: output});
  
// });

module.exports = router;
