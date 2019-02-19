require('dotenv').config();
const passport = require('koa-passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
}, function(payload, done) {
    done(null, false);
}));