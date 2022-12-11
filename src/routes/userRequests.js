'use strict';

const userRequestsRouter = require('express').Router();

const constants = require('../utils/constants');
const userMiddleware = require('../middlewares/user');
const ExpressRouteHandler = require('./routeHandler');

const requestService = require('../service/requests');
const resourceService = require('../service/resources');

userRequestsRouter.use(userMiddleware.verifyUser);

userRequestsRouter.get('/', ExpressRouteHandler(async (req) => {
	const userId = req.userData._id.toString();
	const requests = await requestService.getUserRequests(userId);
	const requestsMapped = requests.map(request => {
		return {
			...request,
			statusDetails: constants.requestStatusesEnumReverse[request.status],
			resourceDetails: request.resourceDetails && request.resourceDetails[0] || {},
		};
	});
	return [{ data: requestsMapped }];
}));

userRequestsRouter.post('/', ExpressRouteHandler(async (req) => {
	const { resourceId, purpose, actions, resourceType } = req.body;
	if (!resourceId) {
		return [{ status: 400, message: 'Resource Id not present' }];
	}
	if (!purpose) {
		return [{ status: 400, message: 'purpose not present' }];
	}
	if (purpose.length < 4) {
		return [{ status: 400, message: 'Please write an elaborate purpose' }];
	}
	if (!Array.isArray(actions) && actions.length === 0) {
		return [{ status: 400, message: 'Action List cannot be empty' }];
	}
	if (!resourceType) {
		return [{ status: 400, message: 'resourceType not present' }];
	}
	if (!constants.resourceTypesInfo[resourceType]) {
		return [{ status: 400, message: 'Invalid Resource Type' }];
	}
	const resourceTypeInfo = constants.resourceTypesInfo[resourceType];

	// validate actions
	if (actions.length > resourceTypeInfo.maxActionCount) {
		return [{ status: 400, message: `Request is for ${actions.length} action(s). Maximum ${resourceTypeInfo.maxActionCount} action(s) are allowed.` }];
	}

	if (!actions.every(action => resourceTypeInfo.supportedActions.includes(action))) {
		return [{ status: 400, message: `Invalid Action. Valid Action(s) are ${resourceTypeInfo.prettyActions}` }];
	}

	// validate resource
	const resourceData = await resourceService.getResourceById(resourceId);
	if (!resourceData || resourceData.length === 0) {
		return [{ status: 404, message: 'Invaid Resource Id' }];
	}
	const resourceDetails = resourceData[0];

	// check if the resource is visible
	const hasAccess = resourceService.isResourceVisibleToUser(req.userData, resourceDetails);
    if (!hasAccess) {
        return [{ status: 403, message: 'You do not have permission to view this resource.' }];
    }

	const userId = req.userData._id.toString();
	const existingUserRequests = await requestService.getUserRequests(userId, constants.requestStatusesEnum.OPEN, resourceId);
	if (existingUserRequests && existingUserRequests.length !== 0) {
		return [{ status: 409, message: 'Request Already Raised' }];
	}

	const addedRequestDetails = await requestService.addUserRequest({
		userId, resourceId, purpose, actions
	});
	return [{
		data: { requestId: addedRequestDetails.insertedId },
		message: `Request Raised with _id: ${addedRequestDetails.insertedId}`,
	}];
}));

userRequestsRouter.delete('/', ExpressRouteHandler(async (req) => {
	const userId = req.userData._id.toString();
	const requestId = req.body.requestId;
	if (!requestId) {
		return [{ status: 400, message: 'Request Id not present' }]
	}

	const existingUserRequests = await requestService.getUserRequestById({ userId, requestId });
	if (!existingUserRequests || existingUserRequests.length === 0) {
		return [{ status: 404, message: 'Request Not Found' }];
	}
	const existingUserRequest = existingUserRequests[0];
	if (existingUserRequest.status !== constants.requestStatusesEnum.OPEN) {
		return [{ status: 405, message: 'Invalid Request Status for deletion' }];
	}
	
	await requestService.updateRequestStatusById({
		requestId, userId,
		status: constants.requestStatusesEnum.DELETED,
	});
	return;
}));

module.exports = userRequestsRouter;