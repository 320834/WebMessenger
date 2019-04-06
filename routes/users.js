var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // var nameVar = req.query.userName;
  // res.render('hello', {name: nameVar});
  // console.log(req.query.userName);
  res.send("Okay This Is It");
});

router.get('/cool', function(req, res, next) {
  // var nameVar = req.query.userName;
  // res.render('hello', {name: nameVar});
  // console.log(req.query.userName);
  res.send("Wow You Are Cool");
});



module.exports = router;
