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

const __ObjectId = (objectId) => {
    return new ObjectId(objectId);
};

module.exports = {
    __ObjectId,
    __stringifyObjectId: stringifyObjectId,
    __startSession: startSession,
    __endSession: endSession,
    Users: new BaseMongoCollection('users'),
    Resources: new BaseMongoCollection('resources'),
    ApiLogs: new BaseMongoCollection('api_logs'),
    Requests: new BaseMongoCollection('requests'),
    UserResources: new BaseMongoCollection('user_resources'),
};