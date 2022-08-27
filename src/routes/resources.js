const resourceRouter = require('express').Router();
const _ = require('underscore');

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

resourceRouter.get('/', ExpressRouteHandler(async () => {
    const allResources = await resourceService.getResources();
    return [{
        data: { resources: allResources },
    }];
}));

// resourceRouter.get('/', async (req, res) => {
//     try {
//         const userData = req.userData;
//         console.log(employeeDetails);
//         const fetchUserRequestStatus = _.isEmpty(employeeDetails) ? false : true;
//         const resourceTypeId = constants.resourceTypes.GITHUB;
//         const query = !fetchUserRequestStatus ? 
//             `SELECT * FROM resources WHERE resource_type_id = ?` :
//             `SELECT r.*, rr.status, rr.requested_by_employee_id FROM resources r
//              LEFT JOIN resource_requests rr ON r.resource_id = rr.resource_id
//              WHERE r.resource_type_id = ? AND (rr.requested_by_employee_id = ? OR rr.requested_by_employee_id IS NULL)`
//         console.log(query);
//         const queryParams = !fetchUserRequestStatus ? [ resourceTypeId ] : [ resourceTypeId, employeeDetails.id ];
//         const data = await executeQuery(query, queryParams );

//         for (const element of data) {
//             element.resource_type_name = 'GITHUB';
//             element.status = constants.requestStatusReverse[element.status] || { name: 'Request Access', color: 'primary', action: 'put' };
//         }

//         console.log(data);
//         return res.send(JSON.stringify(data));
//     } catch (e) {
//         console.error(e);
//         return res.send('ERROR');
//     }
// });

module.exports = resourceRouter;