const UserResourcesRouter = require('express').Router();

const constants = require('../utils/constants');
const userMiddleware = require('../middlewares/user');
const resourceService = require('../service/resources');
const ExpressRouteHandler = require('./routeHandler');
const resourceTypeHandler = require('../resource_types');

UserResourcesRouter.use(userMiddleware.verifyUser);

UserResourcesRouter.get('/type', ExpressRouteHandler(async () => {
    return [{
        data: constants.resourceTypesInfo,
    }];
}));

// returns the resources for which user can request access
UserResourcesRouter.get('/', ExpressRouteHandler(async (req) => {
    const userDetails = req.userData;
    const userId = userDetails._id;
    const userGroupIds = userDetails.userResourceGroupsArray;
    if (!userGroupIds || !Array.isArray(userGroupIds) || userGroupIds.length === 0) {
        return [{
            status: 403,
            message: 'No User Groups found'
        }];
    }

    const allResources = await resourceService.getResourcesByResourceGroupIds(userGroupIds, userId);
    const mappedResources = allResources.map((resource) => {
        const { _id, type, name, path, url, userResources, userRequests } = resource;
        const openRequest = userRequests.find(request => request.status === constants.requestStatusesEnum.OPEN);
        const hasAccess = userResources && userResources[0] && userResources[0]._id ? true : false;
        const hasRequested = openRequest && openRequest._id ? true : false;
        const resourceParams = {
            _id, type, name, path, url,
            hasAccess, hasRequested,
        };
        if (hasRequested) {
            resourceParams.requestedAt = openRequest.createdAt;
        }
        return resourceParams;
    });
    return [{ data: mappedResources }];
}));

UserResourcesRouter.delete('/relinquish', ExpressRouteHandler(async (req) => {
    const { resourceId } = req.body;
    if (!resourceId) {
        return [{ status: 400, message: 'Resource Id not present' }];
    }
    const userDetails = req.userData;

    const resourceDetailsArray = await resourceService.getResourceById(resourceId);
    if (!resourceDetailsArray || resourceDetailsArray.length === 0) {
        return [{ status: 404, message: 'Resource Not found' }];
    }
    const resourceDetails = resourceDetailsArray[0];

    const hasAccess = resourceService.isResourceVisibleToUser(req.userData, resourceDetails);
    if (!hasAccess) {
        return [{ status: 401, message: 'You don\'t have permission to view resource' }];
    }

    await resourceTypeHandler.removeAccess(resourceDetails.type, userDetails.login, resourceDetails.path);
    await resourceService.createUserResourceMapping({
        resourceId,
        status: constants.accessStatusesEnum.RELINQUISHED,
        userId: userDetails._id.toString(),
        lastUpdatedByAdmin: userDetails._id.toString(),
    });
    return;
}));

module.exports = UserResourcesRouter;