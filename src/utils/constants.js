'use strict';

const requestStatusesEnum = {
    'OPEN': 1,
    'APPROVED': 2,
    'REJECTED': 3,
    'DELETED': 4,
};

const requestStatusesEnumReverse = {
    1: { name: 'Waiting for Approval', color: 'info'},
    2: { name: 'Access Granted', color: 'success'},
    3: { name: 'Access Denied', color: 'danger'},
    4: { name: 'Request deleted', color: 'warning' },
};

const accessStatusesEnum = {
    'GRANTED': 1,
    'DENIED': 2,
    'RELINQUISHED': 3,
    'REVOKED': 4,
};

const accessStatusesEnumReverse = {
    1: { name: 'Access Granted', color: 'success'},
    2: { name: 'Access Denied', color: 'danger'},
    3: { name: 'Access Relinquished', color: 'secondary'},
    4: { name: 'Access Revoked', color: 'warning' },
};

const resourceTypesEnum = {
    GITHUB: 1,
};

const resourceTypesEnumReverse = {
    1: 'GITHUB',
};

module.exports = {
    accessStatusesEnum,
    accessStatusesEnumReverse,
    requestStatusesEnum, 
    requestStatusesEnumReverse, 
    resourceTypesEnum,
    resourceTypesEnumReverse, 
}; 