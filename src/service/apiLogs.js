'use strict';

const Mongo = require('../mongo');

const getApiRequest = async(params) => {

};

const logApiRequest = async (req, res) => {
    const {
        method, body, params,
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