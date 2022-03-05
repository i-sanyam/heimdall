const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyToken = (req, res, next) => {
  try {
    const bearerToken = req.cookies.access_token;
    if (bearerToken.length == 0) throw new Error();
     
    jwt.verify(bearerToken, config.TOKEN_SECRET, (err, authData) => {
        if (err) throw Error();
        req.userDetails = authData.userDetails;
        next();
      });
  } catch (authError) {
    return res.send("UNAUTHENTICATED");
  }
}