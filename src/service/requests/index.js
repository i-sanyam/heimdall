'use strict';

const Mongo = require('../../mongo');
const { requestStatusesEnum } = require('../../utils/constants');

const addUserRequest = async (userId, resourceId) => {
    return await Mongo.Requests.insertOne({
        requestRaisedBy: Mongo.__ObjectId(userId),
        resourceId: Mongo.__ObjectId(resourceId),
        status: requestStatusesEnum.OPEN,
    });
}

const getUserRequests = async (userId, status, resourceId) => {
    const findParams = {
        requestRaisedBy: Mongo.__ObjectId(userId),
    };
    if (resourceId) {
        findParams.resourceId = Mongo.__ObjectId(resourceId);
    }
    if (status) {
        findParams.status = status;
    }
    return await Mongo.Requests.find(findParams);
};

const getUserRequestById = async (params, options) => {
    const { userId, requestId, status, resourceId } = params;
    const findParams = {
        _id: Mongo.__ObjectId(requestId),
        requestRaisedBy: Mongo.__ObjectId(userId),
    };
    if (status) {
        findParams.status = status;
    }
    if (resourceId) {
        findParams.resourceId = Mongo.__ObjectId(resourceId);
    }
    return await Mongo.Requests.find(findParams, options);
};

const updateRequestStatusById = async (params) => {
    const { userId, requestId, status } = params;
    const findParams = {
        _id: Mongo.__ObjectId(requestId),
    };
    if (userId) {
        findParams.requestRaisedBy = Mongo.__ObjectId(userId);
    }
    return await Mongo.Requests.updateOne(findParams, { $set: { status } });
}

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
        requestMatch._id = { 
            $in: requestIdsArray.map((requestId) => {
                return Mongo.__ObjectId(requestId);
            }),
        };
    }

    const resourceMatch = {};
    if (resourceGroupIds && resourceGroupIds.length !== 0) {
        resourceMatch['resourceDetails.resourceGroupsArray'] = {
            $in: resourceGroupIds.map((resourceGroupId) => {
                return Mongo.__ObjectId(resourceGroupId);
            }),
        };
    }

    const pipeline = [{ $lookup: lookup }];

    if (Object.keys(requestMatch).length !== 0) {
        pipeline.unshift({ $match: requestMatch });
    }
    if (Object.keys(resourceMatch).length !== 0) {
        pipeline.push({ $match: resourceMatch });
    }
    const requests = await Mongo.Requests.aggregate(pipeline);
    for (const request of requests) {
        if (!request.resourceDetails || 
            !Array.isArray(request.resourceDetails) || 
            request.resourceDetails.length === 0) {
            throw new Error('Resource Attached With Request Not Found');
        }
    }
    return requests;
};

module.exports = {
    addUserRequest,
    getRequestsWithResourceDetails,
    getUserRequests,
    getUserRequestById,
    updateRequestStatusById,
};