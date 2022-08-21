'use strict';

const BaseMongoCollection = require('./base');

class Users extends BaseMongoCollection {
    constructor(COLLECTION_NAME) {
        super(COLLECTION_NAME);
    }
};

module.exports = {
    Users,
};