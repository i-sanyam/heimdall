'use strict';

const requestStatusesEnum = {
    'OPEN': 1,
    'APPROVED': 2,
    'REJECTED': 3,
    'DELETED': 4,
};

const requestStatusesEnumReverse = {
    1: { name: 'Waiting for Approval', color: 'secondary'},
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

const resourceTypesInfo = {
    GITHUB: {
        label: 'GITHUB',
        actionMapping: {
            PULL: 'pull',
            PUSH: 'push',
        },
        supportedActions: ['pull', 'push'],
        prettyActions: ['PULL', 'PUSH'],
        actionSelectType: 'radio',
        options: [
            { label: 'PULL', value: 'pull', },
            { label: 'PUSH', value: 'push', },
        ],
        defaultValue: 'pull',
        maxActionCount: 1,
    },
};

module.exports = {
    accessStatusesEnum,
    accessStatusesEnumReverse,
    requestStatusesEnum, 
    requestStatusesEnumReverse, 
    resourceTypesInfo,
}; 