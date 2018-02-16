const express = require('express');

const router = express.Router();
const { Client } = require('pg');
/* Varð að diabla þessa línu því ég er að nota csv þegar ég er að niðurhala skjalinu */
const csv = require('express-csv'); // eslint-disable-line
const connectionString = process.env.DATABASE_URL || 'postgres://@localhost/postgres';

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}
async function Getgogn() {
/* const client = new Client({
   * user: 'postgres',
   * host: 'localhost',
   * database: 'postgres',
   * password: 'Pluto050196',
   * });
   */
  const client = new Client({ connectionString });
  await client.connect();
  const data = await client.query('SELECT id, date, name, email, ssn, amount FROM tafla');
  await client.end();
  return data.rows;
}

router.get('/admin', ensureLoggedIn, async (req, res) => {
  const data = await Getgogn();
  res.render('admin', { data, footerbreyta: '<p><a href="/"> Forsíða</a></p>' });
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
async function PutData() {
  /* const client = new Client({
   * user: 'postgres',
   * host: 'localhost',
   * database: 'postgres',
   * password: 'Pluto050196',
   * });
   */
  const client = new Client({ connectionString });
  await client.connect();
  const data = await client.query('SELECT date, name, email, amount, ssn FROM tafla');
  await client.end();
  const gogn = data.rows;
  gogn.unshift(['date', 'name', 'email', 'amount', 'ssn']);
  return gogn;
}

/* todo */
router.get('/download', ensureLoggedIn, async (req, res) => {
  const filename = 'test.csv';
  const db = await PutData();
  res.set(
    'Content-Disposition',
    `attachment; filename="${filename}"`,
  );
  res.send(res.csv(db));
});

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    // getum núna notað user í viewum
    res.locals.user = req.user;
  }
  next();
});
function thanks(req, res) {
  const gogn = {};
  res.render('thanks', { gogn, footerbreyta: '<p><a href="/login"> innskráning</a></p>' });
}
router.get('/thanks', thanks);

async function admin(req, res) {
  const data = await Getgogn();
  res.render('admin', { data, footerbreyta: '<p><a> href="/"> Forsíða</a></p>' });
}
router.get('/admin', admin);

module.exports = router;
