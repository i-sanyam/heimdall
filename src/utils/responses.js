'use strict';

const sendApiResponse = (res, params, options) => {
    const { clearCookie = false, cookieNameArray = [] } = options;
    const { status = '200', message = 'OK', data = {} } = params;
    
    if (clearCookie && cookieNameArray.length !== 0) {
        for (const cookieName of cookieNameArray) {
            res.clearCookie(cookieName);
        }
    }
    res.status(status).json({
        statusCode: status,
        message,
        data,
    });
    return;
};

module.exports = { sendApiResponse };