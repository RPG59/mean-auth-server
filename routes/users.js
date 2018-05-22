const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const secureKeys = require('../config/secure-keys');

router.post('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    console.log(req.user);
    res.json({
        success: true,
        user: {
            login: req.user.username,
            email: req.user.email
        }
    })
});

router.post('/registration', (req, res, next) => {
    console.log(req.body);
    let newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            console.log(err);
            res.json({success: false, ms: 'Failed to register user'});
        } else {
            res.json({success: true, ms: 'User register'});
        }
    })
});

router.get('/authenticate', (req, res, next) => {
    res.send('authenticate');
});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    const {login, password} = req.body;
    User.getUserByUsername(login, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({status: 'notFound'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    userId: user._id,
                    time: 600000
                }, secureKeys.SECRET_JWT_KEY);

                res.json({
                    success: true,
                    token: token,
                    user: {
                        login: user.username
                    }
                });
            } else {
                res.statusCode = 502;
                res.json({
                    success: true,
                    errors: [{
                        code: 'invalidPassword'
                    }]
                })
            }

        })

    });
});

module.exports = router;
