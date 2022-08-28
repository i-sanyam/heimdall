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
        _id: new Mongo.__ObjectId(resourceId),
    });
}

const hasResourceGroupAccess = (accessResourceGroups, resourceGroupsToCheck) => {
    for (const accessResourceGroup of accessResourceGroups) {
        if (resourceGroupsToCheck.includes(accessResourceGroup)) {
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