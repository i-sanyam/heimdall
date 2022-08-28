'use strict';

const { ObjectId } = require('mongodb');

const BaseMongoCollection = require('./base');

const startSession = () => {
    return MONGODB_CONNECTOR.startSession();
};

const endSession = (session) => {
    return MONGODB_CONNECTOR.endSession(session);
};

const stringifyObjectId = (objectId) => {
    return new ObjectId(objectId).toString();
};

module.exports = {
    __ObjectId: ObjectId,
    __stringifyObjectId: stringifyObjectId,
    __startSession: startSession,
    __endSession: endSession,
    Users: new BaseMongoCollection('users'),
    Resources: new BaseMongoCollection('resources'),
    ApiLogs: new BaseMongoCollection('api_logs'),
    Requests: new BaseMongoCollection('requests'),
};