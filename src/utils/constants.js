const requestStatus = {
    'OPEN': 1,
    'APPROVED': 2,
    'REJECTED': 3,
    'WITHDRAWN': 4,
    'DELETED': 5,
};

const requestStatusReverse = {
    1: { name: 'Waiting for Approval', color: 'info'},
    2: { name: 'Access Granted', color: 'success'},
    3: { name: 'Request Denied', color: 'danger'},
    4: { name: 'Access Relinquished', color: 'secondary'},
    5: { name: 'Access Revoked', color: 'warning' },
};

const resourceTypes = {
    GITHUB: 1,
};
module.exports = { requestStatus, requestStatusReverse, resourceTypes, gitname: 'pankaj-yadav-shipsy' }; 