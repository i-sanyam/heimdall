const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/login', (req, res) => {
    if (req.body.username == 'sam' && req.body.password == 'sam') {
        const userDetails = {
            id : 1,
        };
      
        jwt.sign({ userDetails }, config.TOKEN_SECRET, { expiresIn: config.SESSION_EXPIRY }, (err, token) => {
            res.cookie('access_token', token);
            return res.send('OK');
        });
        return;
    }
    return res.status(400).send("WRONG PASS OR USERNAME");
});

router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    return res.redirect('/login');
})

router.get('/', (req, res) => {
    res.send("This is the user route");
})

module.exports = router;