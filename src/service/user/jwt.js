const jwt = require('jsonwebtoken');

const JWT_CONFIG = require('../../config.json').JWT;
const logging = require('../../utils/logging');

const generateJWT = async (data) => {
    return new Promise( (resolve, reject) => {
        jwt.sign({ data }, JWT_CONFIG.TOKEN_SECRET, { expiresIn: JWT_CONFIG.SESSION_EXPIRY }, (err, token) => {
            if (err) {
                logging.log('JWT_TOKEN_GENERATE_ERROR', err);
                return reject("Unable to generate token");
            }
            return resolve(token);
        });
    })
};

const verifyJWT = async (token) => {
    if (!token || token.length == 0) {
        throw new Error('Token is required in verifyJWT');
    }
    return new Promise( (resolve, reject) => {
        jwt.verify(token, JWT_CONFIG.TOKEN_SECRET, (err, data) => {
            if (err) {
                logging.log('JWT_TOKEN_VALIDATE_ERROR', err);
                return reject("Error in verification");
            }
            return resolve(data);
        });
    });
};

module.exports = {
    verifyJWT,
    generateJWT,
};