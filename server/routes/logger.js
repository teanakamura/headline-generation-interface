const express = require('express');
const log4js = require('log4js');
const bodyParser = require('body-parser')

const router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

log4js.configure('./server/log4js.config.json');
const accessLogger = log4js.getLogger('access')
const workLogger = log4js.getLogger('work')

router.post('/access', function(req, res, next) {
  accessLogger.info(JSON.stringify(req.body));
  res.end()
})

router.post('/work', function(req, res, next) {
  workLogger.info(JSON.stringify(req.body));
  res.end()
})

module.exports = router;
