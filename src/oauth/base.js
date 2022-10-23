'use strict';

const assert = require('assert');

const Mongo = require('../mongo');
const jwtService = require('../service/jwt');

class OAuthProviderBase {
    constructor(params) {
        const { 
            clientId, clientSecret, 
            accessTokenURL, authorizeURL, callbackURL, userDetailsURL 
        } = params;

        assert(clientId, 'clientId is required to initialise OAuth Provider');
        assert(clientSecret, 'clientSecret is required to initialise OAuth Provider');
        assert(accessTokenURL, 'accessTokenURL is required to initialise OAuth Provider');
        assert(authorizeURL, 'authorizeURL is required to initialise OAuth Provider');
        assert(callbackURL, 'callbackURL is required to initialise OAuth Provider');
        assert(userDetailsURL, 'userDetailsURL is required to initialise OAuth Provider');

        this.CLIENT_ID = clientId;
        this.CLIENT_SECRET = clientSecret;
        this.ACCESS_TOKEN_URL = accessTokenURL;
        this.AUTHORIZE_URL = authorizeURL;
        this.CALLBACK_URL = callbackURL;
        this.USER_DETAILS_URL = userDetailsURL;
    }

    async requestAccessTokenViaCallbackCode(authCode) {
        if (!authCode || authCode.length === 0) {
            throw new Error('Code is required');
        }
        throw new Error('Method is not implemented');
    }

    async requestUserDataViaAccessToken(accessToken) {
        if (!accessToken || accessToken.length === 0) {
            throw new Error('Access Token is required');
        }
        throw new Error('Method is not implemented');
    }

    async validateUserAndGetCookie(userData) {
        let userId = null;

        const existingUserData = await Mongo.Users.find({
            id: userData.id,
            login: userData.login,
            OAUTH_TYPE: this.OAUTH_PROVIDER,
        });
    
        if (!existingUserData || existingUserData.length === 0) {
            const { insertedId: newUserId } = await Mongo.Users.insertOne({
                id: userData.id,
                login: userData.login,
                avatar_url: userData.avatar_url,
                OAUTH_TYPE: this.OAUTH_PROVIDER,
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
    }
};

module.exports = OAuthProviderBase;