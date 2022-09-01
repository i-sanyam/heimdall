'use strict';

const adminRequestsRouter = require('express').Router();

const constants = require('../utils/constants');
const adminMiddleware = require('../middlewares/admin');
const userMiddleware = require('../middlewares/user');
const ExpressRouteHandler = require('./routeHandler');

const requestService = require('../service/requests');
const resourceService = require('../service/resources');
const resourceTypeHandler = require('../resource_types');

adminRequestsRouter.use(userMiddleware.verifyUser);
adminRequestsRouter.use(adminMiddleware.verifyAdmin);

adminRequestsRouter.get('/', ExpressRouteHandler(async (req) => {
    const adminGroupIds = req.userData.adminResourceGroupsArray;

	const requests = await requestService.getRequestsWithResourceDetails({
		resourceGroupIds: adminGroupIds,
	});
	return [{ data: { requests } }];
}));

adminRequestsRouter.post('/reject', ExpressRouteHandler(async (req) => {
	const requestId = req.body.requestId;
	if (!requestId) {
		return [{ status: 400, message: 'Request Id not present' }]
	}

    // TODO: need transaction here
	const existingUserRequests = await requestService.getRequestsWithResourceDetails({
		requestIdsArray: [ requestId ],
	});
	if (!existingUserRequests || !Array.isArray(existingUserRequests) || existingUserRequests.length === 0) {
		return [{ status: 404, message: 'Request Not Found' }];
	}
	const existingUserRequest = existingUserRequests[0];

	const requestedResourceDetails = existingUserRequest.resourceDetails[0];
	const resourceGroupIds = requestedResourceDetails.resourceGroupsArray || [];
	const adminGroupIds = req.userData.adminResourceGroupsArray;
	const hasAdminAccess = resourceService.hasResourceGroupAccess(adminGroupIds, resourceGroupIds);

	if (!hasAdminAccess) {
		return [{ status: 401, message: 'You need admin access for resource' }];
	}

	if (existingUserRequest.status !== constants.requestStatusesEnum.OPEN) {
		return [{ status: 405, message: 'Invalid Request Status for Rejection' }];
	}
	
	await requestService.updateRequestStatusById({
		requestId,
		status: constants.requestStatusesEnum.REJECTED,
        userId: existingUserRequest.requestRaisedBy,
    });
	return;
}));

adminRequestsRouter.post('/approve', ExpressRouteHandler(async (req) => {
	const requestId = req.body.requestId;
	if (!requestId) {
		return [{ status: 400, message: 'Request Id not present' }]
	}

    // TODO: need transaction here
	const existingUserRequests = await requestService.getRequestsWithResourceDetails({
		requestIdsArray: [ requestId ],
	});
	if (!existingUserRequests || !Array.isArray(existingUserRequests) || existingUserRequests.length === 0) {
		return [{ status: 404, message: 'Request Not Found' }];
	}
	const existingUserRequest = existingUserRequests[0];
	
	const requestedResourceDetails = existingUserRequest.resourceDetails[0];
	const resourceGroupIds = requestedResourceDetails.resourceGroupsArray || [];
	const adminGroupIds = req.userData.adminResourceGroupsArray;
	const hasAdminAccess = resourceService.hasResourceGroupAccess(adminGroupIds, resourceGroupIds);

	if (!hasAdminAccess) {
		return [{ status: 401, message: 'You need admin access for approval' }];
	}

	if (existingUserRequest.status !== constants.requestStatusesEnum.OPEN) {
		return [{ status: 405, message: 'Invalid Request Status for approval' }];
	}

	const resourceDetails = existingUserRequest.resourceDetails[0];
	await resourceTypeHandler.addAccess(resourceDetails.type, req.userData.login, resourceDetails.path);
	await requestService.updateRequestStatusById({
		requestId,
		status: constants.requestStatusesEnum.APPROVED,
		userId: existingUserRequest.requestRaisedBy,
	});
	await resourceService.createUserResourceMapping({
		resourceId: resourceDetails._id.toString(),
		status: constants.accessStatusesEnum.GRANTED,
		userId: existingUserRequest.requestRaisedBy,
		lastUpdatedByAdmin: req.userData._id.toString(), 
	});
	return;
}));

module.exports = adminRequestsRouter;

// router.post('/withdraw', async (req, res) => {
//     const requestId = req.body.requestId;
//     const requestData = await executeQuery(`
//     SELECT r.name as resourceName FROM resource_requests rr 
//         JOIN resources r 
//             ON r.resource_id = rr.resource_id
//         WHERE rr.request_id = ?`, [ requestId ]);

//     if (_.isEmpty(requestData)) {
//         return res.send("REQUEST NOT FOUND");
//     }

//     const resourceTypeName = 'github';

//     const fileToRequire = require(`../resource_types/${resourceTypeName}`);
//     // fileToRequire.prerequisite();
//     fileToRequire.actions.removeAccess(requestData[0].resourceName, 'sanyam-aggarwal-shipsy');

//     await executeQuery('UPDATE resource_requests SET status = ? WHERE request_id = ?', [constants.requestStatus.DELETED, requestId]);
//     res.send('REMOVE REQUESTS');
// });
