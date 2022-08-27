'use strict';

const ExpressRouteHandler = require('../routes/routeHandler');
const apiDocsRouter = require('express').Router();

apiDocsRouter.get('/', ExpressRouteHandler(async (req) => {
    return { status: '200' };
}));

module.exports = apiDocsRouter;