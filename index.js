let express = require('express');
let app = express();
var path = require('path');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 
app.get('/', (req, res) => {
  res.render('newindex', {foo: 'FOO'});
});
app.get('/shopnow', (req, res) => {
  res.render('listingpage', {foo: 'FOO'});
});
app.get('/shopproduct', (req, res) => {
  res.render('product-details-affiliate', {foo: 'FOO'});
});
app.get('/contact', (req, res) => {
  res.render('contact-us', {foo: 'FOO'});
});
app.get('/terms-conditions', (req, res) => {
  res.render('terms&conditions', {foo: 'FOO'});
});
app.get('/privacy', (req, res) => {
  res.render('privacypolicy', {foo: 'FOO'});
});
app.get('/aboutus', (req, res) => {
  res.render('aboutus', {foo: 'FOO'});
});
app.get('/myaccount', (req, res) => {
  res.render('my-account', {foo: 'FOO'});
});
app.get('/404', (req, res) => {
  res.render('404', {foo: 'FOO'});
});
app.get('/login-register', (req, res) => {
  res.render('login-register', {foo: 'FOO'});
});
app.get('/blog', (req, res) => {
  res.render('blog-04-columns', {foo: 'FOO'});
});
app.get('/singlepostimage', (req, res) => {
  res.render('single-post-image', {foo: 'FOO'});
});
app.get('/compare', (req, res) => {
  res.render('compare', {foo: 'FOO'});
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));