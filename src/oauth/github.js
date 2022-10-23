'use strict';

const axios = require('axios');

const OAuthProviderBase = require('./base');
const config = require('../config.json');

class OAuthGithub extends OAuthProviderBase {
    constructor(params) {
        this.OAUTH_PROVIDER = 'GITHUB';
        super(params);
    }

    get AUTHORIZE_URL() {
        const AUTHORIZE_URL_INTERFACE = new URL(this.AUTHORIZE_URL);
        AUTHORIZE_URL_INTERFACE.searchParams.append('response_type', 'code');
        AUTHORIZE_URL_INTERFACE.searchParams.append('client_id', this.CLIENT_ID);
        AUTHORIZE_URL_INTERFACE.searchParams.append('redirect_uri', config.SELF_BASE_URL + this.CALLBACK_URL)
        return AUTHORIZE_URL_INTERFACE.href;
    }

    async requestAccessTokenViaCallbackCode(authCode) {
        if (!authCode || authCode.length === 0) {
            throw new Error('Code is required');
        }

        const response = await axios({
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            url: this.ACCESS_TOKEN_URL,
            params: {
                code,
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
            },
        });
        if (response.status != 200 || !response.data?.access_token || response.data.access_token.length === 0) {
            throw new Error('Unable to retrieve access token');
        }
        return response.data.access_token;
    }

    async requestUserDataViaAccessToken(accessToken) {
        if (!accessToken || accessToken.length === 0) {
            throw new Error('Access Token is required');
        }

        const response = await axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `token ${accessToken}`,
            },
            url: this.USER_DETAILS_URL,
        });
        if (response.status != 200 || !response.data) {
            throw new Error('Unable to retrieve user data from access token');
        }
        return response.data;
    }
};

module.exports = OAuthGithub;