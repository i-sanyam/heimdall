const Mongo = require('../../mongo');

const getResourcesByRoleIds = async (roleIds) => {
    return await Mongo.Resources.find({
        resourceGroupsArray: {
            $in: roleIds,
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
    getResourcesByRoleIds,
};