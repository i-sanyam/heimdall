'use strict';

const requestRouter = require('express').Router();
const _ = require('underscore');

const constants = require('../utils/constants');
const userMiddleware = require('../middlewares/user');
const ExpressRouteHandler = require('./routeHandler');

const requestService = require('../service/requests');
const resourceService = require('../service/resources');

requestRouter.use(userMiddleware.verifyUser);

requestRouter.get('/', ExpressRouteHandler(async (req) => {
  const userId = req.userData._id.toString();
  const requests = await requestService.getUserRequests(userId);
  return [{ data: { requests } }];
}));

requestRouter.post('/', ExpressRouteHandler(async (req) => {
  const resourceId = req.body.resourceId;
  if (!resourceId) {
    return [{ status: 400, message: 'Resource Id not present' }]
  }

  const resourceData = await resourceService.getResourceById(resourceId);
  if (_.isEmpty(resourceData)) {
    return [{ status: 404, message: 'Invaid Resource Id' }];
  }

  const userId = req.userData._id.toString();

  const existingUserRequests = await requestService.getUserRequests(userId, resourceId);
  if (!_.isEmpty(existingUserRequests)) {
    return [{ status: 409, message: 'Request Already Raised' }];
  }
  
  await requestService.addUserRequest(userId, resourceId);
  return;
}));

requestRouter.delete('/', ExpressRouteHandler(async (req, res) => {
  const userDetails = req.userData;
  const existingUserRequest = await requestService.getUserRequests(userDetails._id, resourceId);
  if (_.isEmpty(existingUserRequest)) {
    return [{ status: 404, message: 'Request Not Found' }];
  }
  //delete logic
  return;

  // try {
  //   const resourceID = req.body.resourceID;
  //   if (!resourceID) {
  //     return res.status(404).send('Resource Id Not Present');
  //   }
  //   const userDetails = req.userDetails;

  //   const resourceData = await executeQuery('SELECT 1 FROM resources WHERE resource_id = ?', [resourceID]);
  //   if (_.isEmpty(resourceData)) {
  //     return res.status(404).send('Resource Id Not Present');
  //   }

  //   const addRequestQuery = 'UPDATE resource_requests SET status = ? WHERE resource_id = ?';
  //   await executeQuery(addRequestQuery, [constants.requestStatus.DELETED, resourceID]);
  // } catch (e) {
  //   return res.status(400);
  // }
}));

module.exports = requestRouter;