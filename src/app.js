const Express = require("express");
const cookieParser = require('cookie-parser')
const app = Express();
const cors = require('cors');

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api', require('./routes'));

app.get('/api/h', (req, res) => {
  return res.send('OK');
});

MONGODB_CONNECTOR = null;
(async () => {
  const { MONGO_CONNECTOR: db } = await require('./startup')();
  MONGODB_CONNECTOR = db;
  app.listen(3000, () => {
    console.log(`Server started on localhost:3000`);
  });
  const tt = await db.listCollections();
  console.log(tt);
})();


// app.get('/', (req, res) => {
//   auth.verifyToken(req, {
//     // status: () => {
//     // return {
//     send: () => {
//       return res.redirect('/login');
//     }
//     // }
//     // }
//   }, () => {
//     console.error("passed");
//     return res.sendFile(path.resolve('../public/index.html'));
//   });
// });

// app.use('/login', (req, res) => {
//   auth.verifyToken(req, {
//     // status: () => {
//     // return {
//     send: () => {
//       return res.sendFile(path.resolve('./../public/components/userLogin.html'));
//     }
//     // }
//     // }
//   }, () => {
//     console.error("passed");
//     return res.sendFile(path.resolve('./../public/index.html'));
//   });
// });

// app.use('/signup', (req, res) => {
//   auth.verifyToken(req, {
//     // status: () => {
//     // return {
//     send: () => {
//       return res.sendFile(path.resolve('./../public/components/signup.html'));
//     }
//     // }
//     // }
//   }, () => {
//     console.error("passed");
//     return res.sendFile(path.resolve('../public/index.html'));
//   });
// });

// app.use('/api', require('./routes'));