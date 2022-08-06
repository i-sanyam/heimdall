const userRouter = require('express').Router();

const userMiddleware = require('../middlewares/user');

userRouter.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    return res.redirect('/');
});

userRouter.get('/', userMiddleware.verifyUser, (req, res) => {
    return res.send("This is the user route");
});

module.exports = userRouter;