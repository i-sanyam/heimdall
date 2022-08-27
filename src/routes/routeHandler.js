'use strict'

const { sendApiResponse } = require('../utils/responses');
const { endLogApiRequest } = require('../utils/logging');

const ExpressRouteHandler = (fn) => {
    return (async (req, res, next) => {
        const [ response, options ] = await fn(req);
        const jsonResponse = sendApiResponse(res, response, options);
        endLogApiRequest(req, jsonResponse, next);
        return;
    });
};

module.exports = ExpressRouteHandler;