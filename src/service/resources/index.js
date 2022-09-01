const Mongo = require('../../mongo');

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


module.exports = {
    getResourceById,
    getResourcesByResourceGroupIds,
    hasResourceGroupAccess,
};