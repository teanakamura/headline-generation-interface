var express = require('express');
var router = express.Router();

/* GET articles listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'respond with a resource' });
});

module.exports = router;
