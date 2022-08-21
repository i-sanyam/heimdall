const requestStatusesEnum = {
    'OPEN': 1,
    'APPROVED': 2,
    'REJECTED': 3,
    'WITHDRAWN': 4,
    'DELETED': 5,
};

const requestStatusesEnumReverse = {
    1: { name: 'Waiting for Approval', color: 'info'},
    2: { name: 'Access Granted', color: 'success'},
    3: { name: 'Request Denied', color: 'danger'},
    4: { name: 'Access Relinquished', color: 'secondary'},
    5: { name: 'Access Revoked', color: 'warning' },
};

const resourceTypesEnum = {
    GITHUB: 1,
};

const resourceTypesEnumReverse = {
    1: 'GITHUB',
};

module.exports = { 
    requestStatusesEnum, 
    requestStatusesEnumReverse, 
    resourceTypesEnum,
    resourceTypesEnumReverse, 
}; 