'use strict';

class BaseMongoCollection {
    constructor(COLLECTION_NAME) {
        this.collection = COLLECTION_NAME;
        this._collection = MONGODB_CONNECTOR.collection(COLLECTION_NAME);
    }
    async find(filter, options) {
        return await this._collection.find(filter, options);
    }
    async insertOne(doc, options) {
        doc.createdAt = new Date();
        return await this._collection.insertOne(doc, options);
    }
    async updateOne(filter, update, options) {
        update.$set = {
            ...(update.$set || {}),
            updatedAt: new Date(),
        };
        update.$setOnInsert = {
            ...(update.$setOnInsert || {}),
            createdAt: new Date(),
        };
        return await this._collection.updateOne(filter, update, options);
    }
};

module.exports = BaseMongoCollection;