'use strict';

const requestStatusesEnum = {
    'OPEN': 1,
    'APPROVED': 2,
    'REJECTED': 3,
    'RELINQUISH': 4,
    'DELETED': 5,
};

const requestStatusesEnumReverse = {
    1: { name: 'Waiting for Approval', color: 'info'},
    2: { name: 'Access Granted', color: 'success'},
    3: { name: 'Access Denied', color: 'danger'},
    4: { name: 'Access Relinquished', color: 'secondary'},
    5: { name: 'Request deleted', color: 'warning' },
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