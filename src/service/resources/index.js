const constants = require('../../utils/constants');

const Mongo = require('../../mongo');

const createUserResourceMapping = async(params) => {
    const { userId, resourceId, status, lastUpdatedByAdmin } = params;

    const insertParams = {
        status,
        resourceId: Mongo.__ObjectId(resourceId),
        userId: Mongo.__ObjectId(userId),
    };
    if (lastUpdatedByAdmin) {
        insertParams.lastUpdatedByAdmin = Mongo.__ObjectId(lastUpdatedByAdmin);
    }
    
    return await Mongo.UserResources.insertOne(insertParams);
};

const getUserAccesibleResources = async (userId) => {
    return await Mongo.UserResources.aggregate([
        {
            $match: {
                status: constants.accessStatusesEnum.GRANTED,
                userId: Mongo.__ObjectId(userId),
            }
        },
        {
            $lookup: {
                from: 'resources',
                localField: 'resourceId',
                foreignField: '_id',
                as: 'resourceDetails',
            },
        }
    ]);
};

const getResourcesByResourceGroupIds = async (resourceGroupIds) => {
    return await Mongo.Resources.find({
        resourceGroupsArray: {
            $in: resourceGroupIds,
        }
    });
};

const getResourceById = async (resourceId) => {
    return await Mongo.Resources.find({
        _id: Mongo.__ObjectId(resourceId),
    });
}

const hasResourceGroupAccess = (accessResourceGroups, resourceGroupsToCheck) => {
    const sanitizedAccessResourceGroups = accessResourceGroups.map(Mongo.__stringifyObjectId);
    const sanitizedResourceGroupsToCheck = resourceGroupsToCheck.map(Mongo.__stringifyObjectId);
    for (const accessResourceGroup of sanitizedAccessResourceGroups) {
        if (sanitizedResourceGroupsToCheck.includes(accessResourceGroup)) {
            return true;
        }
    }
    return false;
};

const hasAdminResourceAccess = (adminData, resourceData) => {
    const resourceGroupIds = resourceData.resourceGroupsArray || [];
	const adminGroupIds = adminData.adminResourceGroupsArray;
	return hasResourceGroupAccess(adminGroupIds, resourceGroupIds);
};

const hasUserResourceAccess = (adminData, resourceData) => {
    const resourceGroupIds = resourceData.resourceGroupsArray || [];
	const userGroupIds = adminData.userResourceGroupsArray;
	return hasResourceGroupAccess(userGroupIds, resourceGroupIds);
};

module.exports = {
    createUserResourceMapping,
    getResourceById,
    getResourcesByResourceGroupIds,
    getUserAccesibleResources,
    hasAdminResourceAccess,
    hasUserResourceAccess,
};