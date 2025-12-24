import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import {
  CALLBACK_URL,
  CLIENT_ID,
  CLIENT_SECRETE,
} from "../config/environment.config.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRETE,
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
