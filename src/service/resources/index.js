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

const getResourcesByResourceGroupIds = async (resourceGroupIds, userId) => {
    return await Mongo.Resources.aggregate([
        {
            $match: {
                resourceGroupsArray: {
                    $in: resourceGroupIds,
                }
            },
        },
        {
            $lookup: {
                from: 'user_resources',
                localField: '_id',
                foreignField: 'resourceId',
                pipeline: [
                    {
                        $match: {
                            userId: Mongo.__ObjectId(userId),
                        }
                    },
                    {
                        $project: { _id: 1 },
                    }
                ],
                as: 'userResource',
            },
        },
        {
            $project: {
                _id: 1,
                type: 1,
                name: 1,
                path: 1,
                url: 1,
                userResource: {
                    _id: 1,
                },
            },
        }
    ]);
    /**
     * SELECT * FROM resources 
     * LEFT JOIN user_resources ON user_resources.resourceId = resources._id
     * WHERE user_resources.user_id = $1
     */
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

const hasUserResourceAccess = (userData, resourceData) => {
    const resourceGroupIds = resourceData.resourceGroupsArray || [];
	const userGroupIds = userData.userResourceGroupsArray;
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