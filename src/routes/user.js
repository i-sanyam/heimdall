const userRouter = require('express').Router();

const userMiddleware = require('../middlewares/user');
const { sendApiResponse } = require('../utils/responses');
 
userRouter.get('/logout', (req, res) => {
    return sendApiResponse(res, {
        status: 200,
        message: 'OK'
    }, {
        clearCookie: true,
        cookieNameArray: ['access_token']
    });
});

userRouter.get('/', userMiddleware.verifyUser, (req, res) => {
    return sendApiResponse(res, {
        status: 200,
        message: 'Logged In',
        data: {
            user: req.userData,
        }
    });
});

module.exports = userRouter;