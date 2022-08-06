const jwtService = require('./jwt');

const GITHUB_OAUTH_TYPE = "GITHUB";

const validateGithubUserAndGetCookie = async (userData) => {
    const timeNow = new Date();
    let userId = null;
    const existingUserData = await MONGODB_CONNECTOR.collection('users').find({
        id: userData.id,
        login: userData.login,
        OAUTH_TYPE: GITHUB_OAUTH_TYPE,
    }).toArray();
    if (!existingUserData || existingUserData.length === 0) {
        const newUserId = await MONGODB_CONNECTOR.collection('users').insertOne({
            id: userData.id,
            login: userData.login,
            avatar_url: userData.avatar_url,
            OAUTH_TYPE: GITHUB_OAUTH_TYPE,
            oauth_provider_metadata: userData,
            createdAt: timeNow,
            updatedAt: timeNow,
        });
        console.log('deee');
    } else {
        userId = existingUserData[0]._id;
        await MONGODB_CONNECTOR.collection('users').updateOne({
            _id: userId,
        }, { 
            $set: {
                avatar_url: userData.avatar_url,
                updatedAt: timeNow,
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

module.exports = {
    validateUserAndGetCookie,
};