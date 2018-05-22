const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
//////////////////////////////////////
const secretJwtKeys = require('../config/secure-keys');
////////////////////////////////////

module.exports = passport => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
    opts.secretOrKey = secretJwtKeys.SECRET_JWT_KEY;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.getUserById(jwt_payload.userId, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};