'use strict';

const requestStatusesEnum = {
    OPEN: 'OPEN',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    DELETED: 'DELETED',
};

const requestStatusesEnumReverse = {
    OPEN: { name: 'Waiting for Approval', color: 'secondary'},
    APPROVED: { name: 'Access Granted', color: 'success'},
    REJECTED: { name: 'Access Denied', color: 'danger'},
    DELETED: { name: 'Request deleted', color: 'warning' },
};

const accessStatusesEnum = {
    GRANTED: 'GRANTED',
    DENIED: 'DENIED',
    RELINQUISHED: 'RELINQUISHED',
    REVOKED: 'REVOKED',
};

const accessStatusesEnumReverse = {
    GRANTED: { name: 'Access Granted', color: 'success'},
    DENIED: { name: 'Access Denied', color: 'danger'},
    RELINQUISHED: { name: 'Access Relinquished', color: 'secondary'},
    REVOKED: { name: 'Access Revoked', color: 'warning' },
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