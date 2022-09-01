const router = require('express').Router();

const constants = require('../utils/constants');
const adminMiddleware = require('../middlewares/admin');
const userMiddleware = require('../middlewares/user');
const ExpressRouteHandler = require('./routeHandler');

const resourceTypeHandler = require('../resource_types');
const resourceService = require('../service/resources');
const userService = require('../service/user');

router.use(userMiddleware.verifyUser);
router.use(adminMiddleware.verifyAdmin);

router.get('/', ExpressRouteHandler(async (req) => {
    const userDetails = req.userData;
    const adminGroupIds = userDetails.adminResourceGroupsArray;
    const allResources = await resourceService.getResourcesByResourceGroupIds(adminGroupIds);
    return [{ data: { resources: allResources } }];
}));

router.delete('/revoke', ExpressRouteHandler(async (req) => {
    const { resourceId, userId } = req.body;
    if (!resourceId) {
        return [{ status: 400, message: 'Resource Id not present' }];
    }
    if (!userId) {
        return [{ status: 400, message: 'User Id not present' }];
    }

    const userDetailsArray = await userService.getUser(userId);
    if (!userDetailsArray || userDetailsArray.length === 0) {
        return [{ status: 404, message: 'User Not found' }];
    }
    const userDetails = userDetailsArray[0];

    const resourceDetailsArray = await resourceService.getResourceById(resourceId);
    if (!resourceDetailsArray || resourceDetailsArray.length === 0) {
        return [{ status: 404, message: 'Resource Not found' }];
    }
    const resourceDetails = resourceDetailsArray[0];

    const hasAdminAccess = resourceService.hasAdminResourceAccess(req.userData, resourceDetails);
    if (!hasAdminAccess) {
        return [{ status: 401, message: 'You don\'t have admin access for revoke' }];
    }

    await resourceTypeHandler.removeAccess(resourceDetails.type, userDetails.login, resourceDetails.path);
    await resourceService.createUserResourceMapping({
        resourceId, userId,
        status: constants.accessStatusesEnum.REVOKED,
        lastUpdatedByAdmin: req.userData._id.toString(),
    });
    return;
}));

module.exports = router;