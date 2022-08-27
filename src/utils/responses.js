'use strict';

const sendApiResponse = (res, params = {}, options = {}) => {
    const { clearCookie = false, cookieNameArray = [] } = options;
    const { status = '200', message = 'OK', data = {}, err = {} } = params;
    
    if (clearCookie && cookieNameArray.length !== 0) {
        for (const cookieName of cookieNameArray) {
            res.clearCookie(cookieName);
        }
    }

    const jsonResponse = {
        statusCode: status,
        message,
        data,
    };
    if (err && err instanceof Error) {
        jsonResponse.error = {
            message: err.message,
        };
        if (process.env.NODE_ENV != 'production') {
            jsonResponse.error.stack = err.stack;
        }
    }

    res.status(status).json(jsonResponse);
    return;
};

module.exports = { sendApiResponse };