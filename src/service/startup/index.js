module.exports = async () => {
    const MONGO_CONNECTOR = await require('./mongodb')();
    return { MONGO_CONNECTOR };
}