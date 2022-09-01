const router = require('express').Router();

const constants = require('../utils/constants');
const adminMiddleware = require('../middlewares/admin');
const userMiddleware = require('../middlewares/user');
const resourceService = require('../service/resources');
const ExpressRouteHandler = require('./routeHandler');

router.use(userMiddleware.verifyUser);
router.use(adminMiddleware.verifyAdmin);

router.get('/', ExpressRouteHandler(async (req) => {
    const userDetails = req.userData;
    const adminGroupIds = userDetails.adminResourceGroupsArray;
    if (!adminGroupIds || !Array.isArray(adminGroupIds) || adminGroupIds.length === 0) {
        return [{ status: 403, message: 'No User Groups found' }];
    }
    const allResources = await resourceService.getResourcesByResourceGroupIds(adminGroupIds);
    return [{ data: { resources: allResources } }];
}));

module.exports = router;