const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGO_DEFALUT_CONFIG = require('./config.json').MONGODB_DEFAULT;
const client = new MongoClient(MONGO_DEFALUT_CONFIG.URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
const DB_NAME = MONGO_DEFALUT_CONFIG.DBNAME;

const main = async () => {
  await client.connect();
  console.log('Connected successfully to MongoDB server');
  return client.db(DB_NAME);
}

module.exports = main;