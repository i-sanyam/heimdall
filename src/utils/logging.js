'use strict';

const { sendApiResponse } = require('./responses');
const { logApiRequest } = require('../service/apiLogs');

const LOGGING_ENABLED = process.NODE_ENV !== 'production';

const error = (preMessage, err) => {
    if (!LOGGING_ENABLED) {
        return;
    }
    console.error(preMessage, "\n", err);
};

const log = (preMessage, log) => {
    if (!LOGGING_ENABLED) {
        return;
    }
    console.log(preMessage, log);
};

const logAndHandleExpressErrors = (err, req, res, next) => {
    log('API_ERROR', err);
    sendApiResponse(res, {
        status: 500,
        message: 'Something Went Wrong',
        err,
    });
    next();
};

const startLogApiRequest = (req, res, next) => {
    req.__rq_start = new Date().toISOString();

    req.__body = req.body;
    req.__query = req.query;
    req.__params = req.params;

    req.body = req.body || {};
    req.params = req.params || {};

    next();
};

const endLogApiRequest = (req, res, next) => {
    req.__rq_end = new Date().toISOString();
    if (LOGGING_ENABLED) {
        logApiRequest(req, res);
    }
    next();
};

module.exports = { 
    error,
    log,
    logAndHandleExpressErrors,
    logApiRequest,
    startLogApiRequest,
    endLogApiRequest,
};