const userJWTService = require('../service/user/jwt');
const userService = require('../service/user');
const { sendApiResponse } = require('../utils/responses');

const verifyUser = async (req, res, next) => {
    if (!req.cookies?.access_token || req.cookies.access_token.length == 0) {
        return sendApiResponse(res, {
            status: 200,
            message: 'You are not logged in'
        });
    }

    try {
        const { data: userData } = await userJWTService.verifyJWT(req.cookies.access_token);
        const savedUserData = await userService.getUser(userData.id);
        if (!savedUserData || savedUserData.length === 0) {
            throw new Error('User not found');
        }
        req.userData = savedUserData[0];
        next();
    } catch (err) {
        return sendApiResponse(res, {
            status: 400,
            message: 'Unauthenticated',
            data: { err }
        });
    }
};

module.exports = {
    verifyUser,
};