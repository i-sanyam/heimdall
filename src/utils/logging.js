'use strict';
const { sendApiResponse } = require('./responses');

const LOGGING_ENABLED = true;

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
    return sendApiResponse(res, {
        status: 500,
        message: 'Something Went Wrong',
        err,
    });
};

module.exports = { 
    error,
    log,
    logAndHandleExpressErrors,
};