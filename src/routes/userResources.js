const resourceRouter = require('express').Router();

const constants = require('../utils/constants');
const userMiddleware = require('../middlewares/user');
const resourceService = require('../service/resources');
const ExpressRouteHandler = require('./routeHandler');

resourceRouter.use(userMiddleware.verifyUser);

resourceRouter.get('/type', ExpressRouteHandler(async () => {
    const supportedResourceTypes = Object.keys(constants.resourceTypesEnum);
    return [{
        data: { types: supportedResourceTypes },
    }];
}));

resourceRouter.get('/', ExpressRouteHandler(async (req) => {
    const userDetails = req.userData;

    const userGroupIds = userDetails.userResourceGroupsArray;
    if (!userGroupIds || !Array.isArray(userGroupIds) || userGroupIds.length === 0) {
        return [{
            status: 403,
            message: 'No User Groups found'
        }];
    }

    const allResources = await resourceService.getResourcesByResourceGroupIds(userGroupIds);
    return [{ data: { resources: allResources } }];
}));

module.exports = resourceRouter;