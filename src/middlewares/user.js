const userJWTService = require('../service/user/jwt');
const userService = require('../service/user');

const verifyUser = async (req, res, next) => {
    if (!req.cookies?.access_token || req.cookies.access_token.length == 0) {
        return res.redirect('/');
    }
    try {
        const { data: userData } = await userJWTService.verifyJWT(req.cookies.access_token);
        req.userData = await userService.getUser(userData.id);
        console.log('a');
    } catch (err) {
        return res.send('Unauthenticated', err);
    }
};

module.exports = {
    verifyUser,
};