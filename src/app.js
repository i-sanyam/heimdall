const Express = require("express");
const cookieParser = require('cookie-parser')
const app = Express();
const cors = require('cors');


app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

global.MONGODB_CONNECTOR = null;
(async () => {
  const { MONGO_CONNECTOR: db } = await require('./service/startup')();
  global.MONGODB_CONNECTOR = db;
  await db.listCollections();

  const logging = require('./utils/logging');

  app.use(logging.startLogApiRequest);
  app.use('/apidocs', require('./apidocs'))
  app.use('/api', require('./routes'));
  app.get('/', (req, res) => {
    return res.send('Welcome to Heimdall - Open Source Access Management.');
  });
  app.use(logging.logAndHandleExpressErrors);
  app.listen(process.NODE_ENV.PORT || 3000, () => {
    console.log(`Server started on localhost:3000`);
  });
})();