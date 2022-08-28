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


module.exports = {
    getResourceById,
    getResourcesByResourceGroupIds,
};