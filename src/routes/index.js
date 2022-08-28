const Router = require('express').Router();

Router.use('/resource', require('./resources'));
Router.use('/userRequest', require('./userRequests'));
Router.use('/user', require('./user'));
Router.use('/adminRequest', require('./adminRequests'));
Router.use('/oauth', require('./oauth'));

module.exports = Router;
