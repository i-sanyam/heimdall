const Express = require("express");
const cookieParser = require('cookie-parser')
const app = Express();
const cors = require('cors');

// const auth = require('./auth');

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get('/api/h', (req, res) => {
  return res.send('OK');
});
app.get('/oauth/callback', (req, res) => {
  const originalUrl = req.originalUrl;
  const tempCode = originalUrl.split('=')[1];
  return res.send('Paji You are logged in now');
});
app.get('/login', (req, res) => {
  return res.redirect('https://github.com/login/oauth/authorize?response_type=code&client_id=d3f5f83865b9da52e645&scope=read&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fcallback');
})
app.post('/oauth/callback', (req, res) => {
  //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
  return res.send('OK');
});

let MONGODB_CONNECTOR = null;
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