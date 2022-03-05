const express = require('express');
const router = express.Router();
const constants = require('../utils/constants');
const { executeQuery } = require('../startup/mysql');
const _ = require('underscore');

router.use((req, res, next) => {
    // write endpoint protection here
    req.adminDetails = {
        adminId: 1,
    };
    next();
});

router.get('/', async (req, res) => {
    try {
        const adminDetails = req.adminDetails;
        const employeeRequestsQuery = `
            SELECT rr.request_id, r.name, rr.status 
            FROM resource_requests rr JOIN resources r ON r.resource_id = rr.resource_id
        `;
        console.log(employeeRequestsQuery);
        const data = await executeQuery(employeeRequestsQuery);
        for (const element of data) {
            element.resource_type_name = 'GITHUB';
            element.status = constants.requestStatusReverse[element.status] || { name: 'Request Access', color: 'primary', action: 'put' };
        }
        return res.send(JSON.stringify(data));
    } catch (e) {
      return res.status(400);
    }
});

router.post('/approve', async (req, res) => {
    const requestId = req.body.requestId;
    console.log(requestId);
    // const resourceId = req.body.resourceId;
    // const resourceData = await executeQuery('SELECT 1 FROM resources WHERE resource_id = ?', [ resourceId ]);
    // if (_.isEmpty(resourceData)) {
    //     return res.status(404).send('Resource Id Not Present');
    // }
    const requestData = await executeQuery(`
    SELECT r.name as resourceName FROM resource_requests rr 
        JOIN resources r 
            ON r.resource_id = rr.resource_id
        WHERE rr.request_id = ? AND rr.status = ?`, [ requestId, constants.requestStatus.OPEN ]);

    if (_.isEmpty(requestData)) {
        return res.send("REQUEST NOT FOUND");
    }

    const resourceTypeName = 'github';

    const fileToRequire = require(`../resource_types/${resourceTypeName}`);
    // fileToRequire.prerequisite();
    fileToRequire.actions.addAccess(requestData[0].resourceName, 'sanyam-aggarwal-shipsy');

    await executeQuery('UPDATE resource_requests SET status = ? WHERE request_id = ?', [constants.requestStatus.APPROVED, requestId]);
    res.send('ADD REQUESTS');
});

router.post('/withdraw', async (req, res) => {
    const requestId = req.body.requestId;
    const requestData = await executeQuery(`
    SELECT r.name as resourceName FROM resource_requests rr 
        JOIN resources r 
            ON r.resource_id = rr.resource_id
        WHERE rr.request_id = ?`, [ requestId ]);

    if (_.isEmpty(requestData)) {
        return res.send("REQUEST NOT FOUND");
    }

    const resourceTypeName = 'github';

    const fileToRequire = require(`../resource_types/${resourceTypeName}`);
    // fileToRequire.prerequisite();
    fileToRequire.actions.removeAccess(requestData[0].resourceName, 'sanyam-aggarwal-shipsy');

    await executeQuery('UPDATE resource_requests SET status = ? WHERE request_id = ?', [constants.requestStatus.DELETED, requestId]);
    res.send('REMOVE REQUESTS');
});

router.post('/reject', async (req, res) => {
    const requestId = req.body.requestId;
    const requestData = await executeQuery(`
    SELECT r.name as resourceName FROM resource_requests rr 
        JOIN resources r 
            ON r.resource_id = rr.resource_id
        WHERE rr.request_id = ?`, [ requestId ]);

    if (_.isEmpty(requestData)) {
        return res.send("REQUEST NOT FOUND");
    }

    const resourceTypeName = 'github';

    // const fileToRequire = require(`../resource_types/${resourceTypeName}`);
    // // fileToRequire.prerequisite();
    // fileToRequire.actions.addAccess(requestData[0].resourceName, 'sanyam-aggarwal-shipsy');

    await executeQuery('UPDATE resource_requests SET status = ? WHERE request_id = ?', [constants.requestStatus.REJECTED, requestId]);
    res.send('REMOVE REQUESTS');
});

module.exports = router;