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
    return [{
        message: 'Logged In',
        data: {
            user: req.userData,
        }
    }];
}));

module.exports = userRouter;