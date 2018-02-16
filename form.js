const express = require('express');
const { Client } = require ('pg');
const xss = require('xss');
const passport = require('passport');

const router = express.Router();
const { check, validationResult } = require('express-validator/check');
//const connectionString = 'postgres://notandi:@localhost/v2';


router.get('/login', async (req, res) => {
  res.render('login', {footerbreyta: '<p><a href="/"> Forsíða</a></p>'});
});

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.body;
  res.render('form',{data,footerbreyta:`
  <p>Innskráður notandi: ${req.user.username}</p>
  <p><a href="/logout">Útskráning</a></p>
  <p><a href="/admin">Skoða leyndarmál</a></p>
`});
  }
  const data = req.body;
  res.render('form', {data, footerbreyta:'<p><a href="\login"> inskráning</a></p>'});
});



router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    console.log("test");
    res.redirect('/admin');
  },
);
async function SkraIGogn(name, email, ssn, amount){
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Pluto050196',
  });
  await client.connect();
  await client.query(
    'INSERT INTO tafla(name, email, ssn, amount) VALUES ($1, $2, $3, $4);', [
      xss(name),
      xss(email),
      xss(ssn),
      xss(amount),
  ]);
  await client.end();
}
router.post('/register',
// Þetta er bara validation! Ekki sanitization
   check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
   check('email').isLength({ min: 1}).withMessage('Netfang má ekki vera tómt'),
   check('email').isEmail().withMessage('Netfang verður að vera netfang'),
   check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
   check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
   check('amount').isInt({min: 1, max: 2147483647}).withMessage('Talan má ekki vera mínustala og ekki of stór'),

   async (req, res) => {
    console.log(req.body);
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('test', data.name);
      data.err = errors.array().map(i => i.msg);
      console.log(data)
      return res.render('form' ,{ data,footerbreyta:'<p><a href="\login"> inskráning</a></p>'});
    }
    await  SkraIGogn (data.name, data.email,data.ssn,data.amount);
    res.redirect('/thanks');
  }
  );
module.exports = router;