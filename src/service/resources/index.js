const Mongo = require('../../mongo');

const getResources = async () => {
    return await Mongo.Resources.find({});
};

const getResourceById = async (resourceId) => {
    return await Mongo.Resources.find({
        _id: new Mongo.__ObjectId(resourceId),
    });
}


module.exports = {
    getResourceById,
    getResources,
};