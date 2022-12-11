const userRouter = require('express').Router();

const userMiddleware = require('../middlewares/user');
const ExpressRouteHandler = require('./routeHandler');

userRouter.use(userMiddleware.verifyUser);

userRouter.get('/logout', ExpressRouteHandler((req, res) => {
    return [{}, {
        clearCookie: true,
        cookieNameArray: ['access_token']
    }];
}));

userRouter.get('/', ExpressRouteHandler((req, res) => {
    const userData = req.userData;
    const parsedUserData = {
        login: userData.login,
        avatar_url: userData.avatar_url,
        isAdmin: Array.isArray(userData.adminResourceGroupsArray) && userData.adminResourceGroupsArray.length > 0,
        _id: userData._id,
    }
    return [{
        message: 'Logged In',
        data: parsedUserData,
    }];
}));

module.exports = userRouter;