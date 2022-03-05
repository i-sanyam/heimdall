const router = require('express').Router();
const axios = require('axios');
const { executeQuery } = require('../startup/mysql');
const constants = require('../utils/constants');
const _ = require('underscore');

router.use((req, res, next) => {
  // write auth middleware here
  req.employeeDetails = {
    id: 1,
  };
  next();
});

router.get('/', async (req, res) => {
  try {
    const userDetails = req.employeeDetails;
    console.log(userDetails);
    const employeeRequestsQuery = 'SELECT * FROM resource_requests WHERE requested_by_employee_id = ?';
    const data = await executeQuery(employeeRequestsQuery, [ userDetails.id ]);
    return res.send(JSON.stringify(data));
  } catch (e) {
    return res.status(400);
  }
});

// ADD NEW REQUEST
router.post('/', async (req, res) => {
    try {
      const resourceID = req.body.resourceID;
      if (!resourceID) {
        return res.status(404).send('Resource Id Not Present');
      }
      const userDetails = req.employeeDetails;

      const resourceData = await executeQuery('SELECT 1 FROM resources WHERE resource_id = ?', [ resourceID ]);
      if (_.isEmpty(resourceData)) {
        return res.status(404).send('Resource Id Not Present');
      }

      const addRequestQuery = "INSERT INTO resource_requests (requested_by_employee_id, resource_id, status) VALUES (?,?,?)";
      const data = await executeQuery(addRequestQuery, [ userDetails.id, resourceID, constants.requestStatus.OPEN ]);
      return res.send('OK');
    } catch (e) {
      return res.status(400);
    }
});

router.delete('/', async (req, res) => {
  try {
    const resourceID = req.body.resourceID;
    if (!resourceID) {
      return res.status(404).send('Resource Id Not Present');
    }
    const userDetails = req.userDetails;

    const resourceData = await executeQuery('SELECT 1 FROM resources WHERE resource_id = ?', [ resourceID ]);
    if (_.isEmpty(resourceData)) {
      return res.status(404).send('Resource Id Not Present');
    }

    const addRequestQuery = 'UPDATE resource_requests SET status = ? WHERE resource_id = ?';
    await executeQuery(addRequestQuery, [ constants.requestStatus.DELETED,  resourceID ]);
  } catch (e) {
    return res.status(400);
  }
});

module.exports = router;