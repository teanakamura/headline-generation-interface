const express = require('express');
const log4js = require('log4js');
const bodyParser = require('body-parser')
const fs = require("fs");
const readline = require("readline");

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
  // res.end();
  // res.sendStatus(200);
  res.status(200).send({status: 'OK'})
})

router.post('/work', function(req, res, next) {
  workLogger.info(JSON.stringify(req.body));
  // res.end()
  // res.sendStatus(200);
  res.status(200).send({status: 'OK'})
})

router.get('/work', function(req, res, next) {
  // Streamを準備
  const stream = fs.createReadStream(`log/work.${req.query.date}.log`, {
                    encoding: "utf8",         // 文字コード
                    highWaterMark: 1024       // 一度に取得するbyte数
                  });

  // readlineの方ではerrorを捉えられないため，fsの方でerrorをチェックする
  stream.on('error', next);

  // readlineにStreamを渡す
  const rl = readline.createInterface({input: stream});
  let lines = []
  rl.on('line', (line) => {
    let lineObject = JSON.parse(line);
    if (lineObject.user == 'jiji') {lines.push(lineObject.work.slice(-1)[0]);}
  }).on('close', () => {
    res.status(200).json(lines);
  })
  // res.status(200).send({status: 'OK'})
  // res.status(200).json({user: 'apple'});
})

router.get('/works', function(req, res, next) {
  fs.readdir('log/', (err, fls) => {
    if (err) {next(err);}
    let ret = fls.filter(f => fs.statSync(`log/${f}`).isFile() && /work.\d{8}.log/.test(f));
    res.status(200).json(ret);
  })
})

module.exports = router;
