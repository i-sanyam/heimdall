'use strict';

const Mongo = require('../mongo');

const getApiRequest = async(url) => {
    return await Mongo.ApiLogs.find({url});
};

const logApiRequest = async (req, res) => {
    const {
        method, body, params, query,
        ip,
        originalUrl, 
        __rq_start: requestStartedAt, __rq_end: requestEndedAt,
    } = req;
    await Mongo.ApiLogs.insertOne({
        method,
        ip,
        url: originalUrl,
        request: {
            body,
            params,
            query,
        },
        response: res,
        requestStartedAt,
        requestEndedAt,
    });
};

module.exports = {
    getApiRequest,
    logApiRequest,
}