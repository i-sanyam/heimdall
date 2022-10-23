'use strict';

const Mongo = require('../../mongo');

const getUser = async (userId) => {
    if (!userId) {
        throw new Error('userId is required');
    }
    return await Mongo.Users.find({
        _id: Mongo.__ObjectId(userId),
    });
}

module.exports = {
    getUser,
};