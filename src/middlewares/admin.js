const { sendApiResponse } = require('../utils/responses');

const verifyAdmin = async (req, res, next) => {
    const userDetails = req.userData;
    if (!userDetails) {
        return sendApiResponse(res, { status: 401, message: 'You are not logged in' });
    }

    const adminGroupIds = userDetails.adminResourceGroupsArray;
    if (!adminGroupIds || !Array.isArray(adminGroupIds) || adminGroupIds.length === 0) {
        return sendApiResponse(res, { status: 401, message: 'Admin Unauthorized' });
    }
    next();
};

module.exports = {
    verifyAdmin,
};