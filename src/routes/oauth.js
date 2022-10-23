'use strict';

const oAuthRouter = require('express').Router();
const assert = require('assert');

const userMiddleware = require('../middlewares/user');
const Mongo = require('../mongo');
const OAuthHandler = require('../oauth');

oAuthRouter.use(userMiddleware.getOrganisationId);

oAuthRouter.use(async (req, res, next) => {
    const { oauth: oauthData } = await Mongo.OrganisationConfig.findOne({ id: req.organisationId });
    assert(oauthData.provider, 'OAuth Provider is not set');
    const OAuthProviderClass = OAuthHandler[oauthData.provider];
    assert(OAuthProviderClass, `${oauthData.provider} OAuth is not implemented`);
    req.handlerOAuth = new OAuthProviderClass(oauthData);
    next();
});

oAuthRouter.get('/callback', async (req, res) => {
    const originalUrl = req.originalUrl;
    const tempCode = originalUrl.split('=')[1];
    const cookie = await req.handlerOAuth.getUserCookieViaCallbackAuthCode(tempCode);
    res.cookie('access_token', cookie);
    return res.redirect('/api/resource');
});

oAuthRouter.get('/login', (req, res) => {
    return res.redirect(req.handlerOAuth.LOGIN_AUTHORIZE_URL);
});

module.exports = oAuthRouter;