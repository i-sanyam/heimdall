'use strict';

const adminRequestsRouter = require('express').Router();
const _ = require('underscore');

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
	
	await requestService.rejectRequestById({
        userId: existingUserRequest.requestRaisedBy,
        requestId
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
		return [{ status: 401, message: 'You need admin access for resource' }];
	}

	if (existingUserRequest.status !== constants.requestStatusesEnum.OPEN) {
		return [{ status: 405, message: 'Invalid Request Status for Rejection' }];
	}

	const resourceDetails = existingUserRequest.resourceDetails[0];
	await resourceTypeHandler.addAccess(resourceDetails.type, req.userData.login, resourceDetails.path);
	return;
}));

module.exports = adminRequestsRouter;

// router.post('/approve', async (req, res) => {
//     const requestId = req.body.requestId;
//     console.log(requestId);
//     // const resourceId = req.body.resourceId;
//     // const resourceData = await executeQuery('SELECT 1 FROM resources WHERE resource_id = ?', [ resourceId ]);
//     // if (_.isEmpty(resourceData)) {
//     //     return res.status(404).send('Resource Id Not Present');
//     // }
//     const requestData = await executeQuery(`
//     SELECT r.name as resourceName FROM resource_requests rr 
//         JOIN resources r 
//             ON r.resource_id = rr.resource_id
//         WHERE rr.request_id = ? AND rr.status = ?`, [ requestId, constants.requestStatus.OPEN ]);

//     if (_.isEmpty(requestData)) {
//         return res.send("REQUEST NOT FOUND");
//     }

//     const resourceTypeName = 'github';

//     const fileToRequire = require(`../resource_types/${resourceTypeName}`);
//     // fileToRequire.prerequisite();
//     fileToRequire.actions.addAccess(requestData[0].resourceName, 'sanyam-aggarwal-shipsy');

//     await executeQuery('UPDATE resource_requests SET status = ? WHERE request_id = ?', [constants.requestStatus.APPROVED, requestId]);
//     res.send('ADD REQUESTS');
// });

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
