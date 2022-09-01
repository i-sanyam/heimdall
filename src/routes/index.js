const Router = require('express').Router();

Router.use('/adminResource', require('./adminResources'));
Router.use('/userResource', require('./userResources'));

Router.use('/adminRequest', require('./adminRequests'));
Router.use('/userRequest', require('./userRequests'));

Router.use('/user', require('./user'));
Router.use('/oauth', require('./oauth'));

module.exports = Router;
