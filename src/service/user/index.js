'use strict';

const jwtService = require('../jwt');
const Mongo = require('../../mongo');

const GITHUB_OAUTH_TYPE = "GITHUB";

const validateGithubUserAndGetCookie = async (userData) => {
    let userId = null;

    const existingUserData = await Mongo.Users.find({
        id: userData.id,
        login: userData.login,
        OAUTH_TYPE: GITHUB_OAUTH_TYPE,
    });

    if (!existingUserData || existingUserData.length === 0) {
        const { insertedId: newUserId } = await Mongo.Users.insertOne({
            id: userData.id,
            login: userData.login,
            avatar_url: userData.avatar_url,
            OAUTH_TYPE: GITHUB_OAUTH_TYPE,
            oauth_provider_metadata: userData,
        });
        userId = newUserId;
    } else {
        userId = existingUserData[0]._id;
        await Mongo.Users.updateOne({
            _id: userId,
        }, { 
            $set: {
                avatar_url: userData.avatar_url,
            }
        });
    }

    return jwtService.generateJWT({
        id: userId,
    });
};

const validateUserAndGetCookie = async (oauthType, userData) => {
    if (oauthType === 'GITHUB') {
        return await validateGithubUserAndGetCookie(userData);
    }
    throw new Error('Oauth Method not available');
};

const getUser = async (userId) => {
    if (!userId) {
        throw new Error('userId is required');
    }
   return await Mongo.Users.find({
        _id: new Mongo.__ObjectId(userId),
    });
}

module.exports = {
    validateUserAndGetCookie,
    getUser,
};