'use strict';

const Mongo = require('../../mongo');

const addUserRequest = async (userId, resourceId) => {
    return await Mongo.Requests.insertOne({
        requestRaisedBy: new Mongo.__ObjectId(userId),
        resourceId: new Mongo.__ObjectId(resourceId),
    });
}

const getUserRequests = async (userId, resourceId) => {
    const findParams = {
        requestRaisedBy: new Mongo.__ObjectId(userId),
    };
    if (resourceId) {
        findParams.resourceId = new Mongo.__ObjectId(resourceId);
    }
    return await Mongo.Requests.find(findParams);
};

const getUserRequestById = async (userId, requestId) => {
    return await Mongo.Requests.find({
        _id: new Mongo.__ObjectId(requestId),
        requestRaisedBy: new Mongo.__ObjectId(userId),
    });
};

module.exports = {
    addUserRequest,
    getUserRequests,
    getUserRequestById,
};