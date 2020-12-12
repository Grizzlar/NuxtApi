var express = require('express');
var db = require('./../db.js');
var router = express.Router();

router.get('/', (req, res)=>{
  res.send('POST ONLY')
})

router.post('/login', (req, res) => {
  db.login(req.body.email, req.body.pass).then(user => {
    res.json(user)
  })
})

router.post('/renew', (req, res) => {
  db.renewToken(req.body.email, req.body.token).then(user => {
    res.json(user)
  })
})

router.post('/register', (req, res) => {
  res.send('REGISTER');
})

router.post('/forgot', (req, res) => {
  res.send('FORGOT');
})

module.exports = router