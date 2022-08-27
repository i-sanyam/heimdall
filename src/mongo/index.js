'use strict';

const BaseMongoCollection = require('./base');

module.exports = {
    Users: new BaseMongoCollection('users'),
    Resources: new BaseMongoCollection('resources'),
    ApiLogs: new BaseMongoCollection('api_logs'),
};