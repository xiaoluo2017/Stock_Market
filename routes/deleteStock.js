var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var config = require('./config');

router.post('/', function(req, res, next) {
  mongo.connect(config.DATABASE_URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("stocks");
    collection.remove({
      name: req.body.name
    }, function (err) {
      if (err) throw err;
      db.close();
    })
    res.send();
  })
});

module.exports = router;