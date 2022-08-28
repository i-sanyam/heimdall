'use strict';

const Mongo = require('../../mongo');
const { requestStatusesEnum } = require('../../utils/constants');

const addUserRequest = async (userId, resourceId) => {
    return await Mongo.Requests.insertOne({
        requestRaisedBy: new Mongo.__ObjectId(userId),
        resourceId: new Mongo.__ObjectId(resourceId),
        status: requestStatusesEnum.OPEN,
    });
}

const getUserRequests = async (userId, status, resourceId) => {
    const findParams = {
        requestRaisedBy: new Mongo.__ObjectId(userId),
    };
    if (resourceId) {
        findParams.resourceId = new Mongo.__ObjectId(resourceId);
    }
    if (status) {
        findParams.status = status;
    }
    return await Mongo.Requests.find(findParams);
};

const getUserRequestById = async (params, options) => {
    const { userId, requestId, status, resourceId } = params;
    const findParams = {
        _id: new Mongo.__ObjectId(requestId),
        requestRaisedBy: new Mongo.__ObjectId(userId),
    };
    if (status) {
        findParams.status = status;
    }
    if (resourceId) {
        findParams.resourceId = new Mongo.__ObjectId(resourceId);
    }
    return await Mongo.Requests.find(findParams, options);
};

const deleteRequestById = async (params) => {
    const { userId, requestId } = params;
    return await Mongo.Requests.updateOne({
        _id: new Mongo.__ObjectId(requestId),
        requestRaisedBy: new Mongo.__ObjectId(userId),
    }, {
        $set: { status: requestStatusesEnum.DELETED },
    });
};

const rejectRequestById = async (params) => {
    const { userId, requestId } = params;
    return await Mongo.Requests.updateOne({
        _id: new Mongo.__ObjectId(requestId),
        requestRaisedBy: new Mongo.__ObjectId(userId),
    }, {
        $set: { status: requestStatusesEnum.REJECTED },
    });
};

const getUserRequestByIdWithResourceGroupIds = async (params, options) => {
    const { requestIdsArray } = params;
    const pipeline = [
        {
            $match: { 
                _id: { $in: requestIdsArray },
            }
        },
        {
            $lookup: {
                "from": 'resources',
                "localField": 'resourceId',
                "foreignField": '_id',
                "as": "resourceDetails"
            },
        },
    ];
    return await Mongo.Requests.aggregate(pipeline);
};

const getRequestsByResourceGroupIds = async (resourceGroupIds, status) => {
    const pipeline = [
        {
            $lookup: {
                "from": 'resources',
                "localField": 'resourceId',
                "foreignField": '_id',
                "as": "resourceDetails"
            },
        },
        {
            $match: { 
                'resourceDetails.resourceGroupsArray': { $in: resourceGroupIds }
            },
        }
    ];
    return await Mongo.Requests.aggregate(pipeline);
};

const getRequestsWithResourceDetails = async (params, options) => {
    const { requestIdsArray = [], resourceGroupIds = [], status } = params;

    const lookup = {
        from: 'resources',
        localField: 'resourceId',
        foreignField: '_id',
        as: 'resourceDetails',
    };

    const requestMatch = {};
    if (status) {
        requestMatch.status = status;
    }
    if (requestIdsArray && requestIdsArray.length !== 0) {
        requestMatch._id = { $in: requestIdsArray };
    }

    const resourceMatch = {};
    if (resourceGroupIds && resourceGroupIds.length !== 0) {
        resourceMatch['resourceDetails.resourceGroupsArray'] = { $in: resourceGroupIds };
    }

    const pipeline = [
        { $match: requestMatch },
        { $lookup: lookup },
        { $match: resourceMatch },
    ];
    return await Mongo.Requests.aggregate(pipeline);
};

module.exports = {
    addUserRequest,
    deleteRequestById,
    getRequestsByResourceGroupIds,
    getRequestsWithResourceDetails,
    getUserRequests,
    getUserRequestById,
    getUserRequestByIdWithResourceGroupIds,
    rejectRequestById,
};