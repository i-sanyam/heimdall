'use strict';

const { ObjectId } = require('mongodb');

const BaseMongoCollection = require('./base');

module.exports = {
    __ObjectId: ObjectId,
    Users: new BaseMongoCollection('users'),
    Resources: new BaseMongoCollection('resources'),
    ApiLogs: new BaseMongoCollection('api_logs'),
    Requests: new BaseMongoCollection('requests'),
};