var express = require('express');
var router = express.Router();
var log4js = require('log4js');

log4js.configure('./server/log4js.config.json');
var systemLogger = log4js.getLogger('system');
var accessLogger = log4js.getLogger('access')


systemLogger.level = 'debug';
systemLogger.debug('hoge hoge');

/* GET logger listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'logger path' });
});

module.exports = router;
