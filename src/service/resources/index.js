const Mongo = require('../../mongo');

const getResources = async () => {
    return await Mongo.Resources.find({});
}

module.exports = {
    getResources,
};