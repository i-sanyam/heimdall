const oAuthRouter = require('express').Router();
const axios = require('axios');

const config = require('../config.json');

const { validateUserAndGetCookie } = require('../service/user');

const GITHUB_AUTHORIZE_URL_INTERFACE = new URL(config.OAUTH.GITHUB.AUTHORIZE_URL);
GITHUB_AUTHORIZE_URL_INTERFACE.searchParams.append('response_type', 'code');
GITHUB_AUTHORIZE_URL_INTERFACE.searchParams.append('client_id', config.OAUTH.GITHUB.CLIENT_ID);
GITHUB_AUTHORIZE_URL_INTERFACE.searchParams.append('redirect_uri', config.SELF_BASE_URL + config.OAUTH.GITHUB.CALLBACK_URL)
const GITHUB_AUTHORIZE_URL = GITHUB_AUTHORIZE_URL_INTERFACE.href;

const requestAccessToken = async (code) => {
    if (!code || code.length === 0) {
        throw new Error('Code is required');
    }
    const response = await axios({
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        url: config.OAUTH.GITHUB.ACCESS_TOKEN_URL,
        params: {
            code,
            client_id: config.OAUTH.GITHUB.CLIENT_ID,
            client_secret: config.OAUTH.GITHUB.CLIENT_SECRET,
        },
    });
    if (response.status != 200 || !response.data?.access_token || response.data.access_token.length === 0) {
        throw new Error('Unable to retrieve access token');
    }
    return response.data.access_token;
};

const requestUserData = async (accessToken) => {
    if (!accessToken || accessToken.length === 0) {
        throw new Error('Access Token is required');
    }
    const response = await axios({
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `token ${accessToken}`,
        },
        url: config.OAUTH.GITHUB.USER_DETAILS_URL,
    });
    if (response.status != 200 || !response.data) {
        throw new Error('Unable to retrieve user data from access token');
    }
    return response.data;
}

oAuthRouter.get('/callback', async (req, res) => {
    const originalUrl = req.originalUrl;
    const tempCode = originalUrl.split('=')[1];
    const accessToken = await requestAccessToken(tempCode);
    const userData = await requestUserData(accessToken);
    const cookie = await validateUserAndGetCookie('GITHUB', userData);
    res.cookie('access_token', cookie);
    return res.redirect('/api/resource');
});

oAuthRouter.get('/login', (req, res) => {
    return res.redirect(GITHUB_AUTHORIZE_URL);
});

module.exports = oAuthRouter;