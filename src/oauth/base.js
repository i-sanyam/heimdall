'use strict';

const assert = require('assert');

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

    static async requestAccessTokenViaCallbackCode(authCode) {
        if (!authCode || authCode.length === 0) {
            throw new Error('Code is required');
        }
        throw new Error('Method is not implemented');
    }

    static async requestUserDataViaAccessToken(accessToken) {
        if (!accessToken || accessToken.length === 0) {
            throw new Error('Access Token is required');
        }
        throw new Error('Method is not implemented');
    }

    static async validateUserAndGetCookie(userData) {
        throw new Error('Method is not implemented');
    }
};

module.exports = OAuthProviderBase;