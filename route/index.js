const auth = require('./auth');
const dashboard = require('./dashboard');
const authentication = require('../middleware/web_authentication');
const category = require('./category');
const product = require('./product');
const banner = require('./banner');

module.exports = (app) => {
  app.use('/', auth);
  app.use('/dashboard', authentication, dashboard);
  app.use('/category', authentication, category);
  app.use('/product', authentication, product);
  app.use('/banner', authentication, banner);
}