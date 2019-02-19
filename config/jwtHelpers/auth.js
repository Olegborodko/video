require('dotenv').config();
const passport = require('koa-passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
}, ((payload, done) => {
    done(null, false);
})));
