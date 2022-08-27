'use strict';

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
    res.status(500)
    res.render('error', { error: err });
    return;
};

module.exports = { 
    error,
    log,
    logAndHandleExpressErrors,
};