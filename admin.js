const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-local');
const users = require('./users');
const { check, validationResult } = require('express-validator/check');
const { Client } = require('pg');
const csv = require('express-csv');

function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  }

  router.get('/admin', ensureLoggedIn, async (req, res) => {
      console.log("test2");
      const data = await Getgogn();
      console.log(data);
      res.render('admin', { data, footerbreyta:'<p><a href="/"> Forsíða</a></p>' });
  });


  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

/* todo */
router.get('/download', (req, res) => {
    const filename = 'test.csv';
    const data = PutData()
    .then (data=>{
        res.set('Content-Disposition',
                `attachment; filename="${filename}"`);
                res.send(res.csv(data));
    })
    .catch(err=>{
      res.render('error');
    });
});
  router.use((req, res, next) => {
    if (req.isAuthenticated()) {
      // getum núna notað user í viewum
      res.locals.user = req.user;
    }
    next();
  });
function thanks(req, res){
    const gogn = {}
    res.render('thanks', {gogn, footerbreyta:'<p><a href="\login"> inskráning</a></p>'});
}
router.get('/thanks', thanks);

async function admin (req, res){
    const data = await Getgogn();
    res.render('admin', { data, footerbreyta:'<p><a> href="/"> Forsíða</a></p>' });
}
router.get('/admin', admin);

async function Getgogn(){
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'Pluto050196',
      });
        await client.connect();
        const data =  await client.query(
        'SELECT id, date, name, email, ssn, amount FROM tafla',
      )
      await client.end()
      console.log(data.rows);
      return data.rows;
}

async function PutData(name, email, ssn, amount){
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'Pluto050196',
      });
      await client.connect();
    const data =  await client.query(
        'SELECT date, name, email, amount, ssn FROM tafla',
    )
    await client.end()
    const gogn  = data.rows;
    gogn.unshift(['date', 'name', 'email', 'amount', 'ssn']);
    return gogn;
}

module.exports = router;
