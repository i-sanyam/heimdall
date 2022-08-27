'use strict';

const apiDocsRouter = require('express').Router();

const ExpressRouteHandler = require('../routes/routeHandler');
const { getApiRequest } = require('../service/apiLogs');

apiDocsRouter.get('/', ExpressRouteHandler(async (req) => {
    const url = req.query.url;
    if (!url || url.length === 0) {
        throw new Error('URL cannot be empty');
    }
    const apiRequestLogs = await getApiRequest(url);
    return {
        status: '200',
        data: { logs: apiRequestLogs }
    };
}));

module.exports = apiDocsRouter;