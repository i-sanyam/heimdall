'use strict';

const assert = require('assert');

const Mongo = require('../mongo');
const jwtService = require('../service/jwt');

class OAuthProviderBase {
    constructor(params) {
        const { 
            CLIENT_ID, CLIENT_SECRET, 
            ACCESS_TOKEN_URL, AUTHORIZE_URL, CALLBACK_URL, USER_DETAILS_URL 
        } = params;

        assert(CLIENT_ID, 'CLIENT_ID is required to initialise OAuth Provider');
        assert(CLIENT_SECRET, 'CLIENT_SECRET is required to initialise OAuth Provider');
        assert(ACCESS_TOKEN_URL, 'ACCESS_TOKEN_URL is required to initialise OAuth Provider');
        assert(AUTHORIZE_URL, 'AUTHORIZE_URL is required to initialise OAuth Provider');
        assert(CALLBACK_URL, 'CALLBACK_URL is required to initialise OAuth Provider');
        assert(USER_DETAILS_URL, 'USER_DETAILS_URL is required to initialise OAuth Provider');

        this.CLIENT_ID = CLIENT_ID;
        this.CLIENT_SECRET = CLIENT_SECRET;
        this.ACCESS_TOKEN_URL = ACCESS_TOKEN_URL;
        this.AUTHORIZE_URL = AUTHORIZE_URL;
        this.CALLBACK_URL = CALLBACK_URL;
        this.USER_DETAILS_URL = USER_DETAILS_URL;
    }

    get LOGIN_AUTHORIZE_URL() {
        throw new Error('Getter is not defined');
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

    async getUserCookieViaCallbackAuthCode(authCode) {
        const accessToken = await this.requestAccessTokenViaCallbackCode(authCode);
        const userData = await this.requestUserDataViaAccessToken(accessToken);
        const cookie = await this.validateUserAndGetCookie(userData);
        return cookie;
    }
};

module.exports = OAuthProviderBase;