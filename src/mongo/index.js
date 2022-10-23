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
    ApiLogs: new BaseMongoCollection('api_logs'),
    OrganisationConfig: new BaseMongoCollection('organisation_config'),
    Resources: new BaseMongoCollection('resources'),
    Requests: new BaseMongoCollection('requests'),
    UserResources: new BaseMongoCollection('user_resources'),
    Users: new BaseMongoCollection('users'),
};