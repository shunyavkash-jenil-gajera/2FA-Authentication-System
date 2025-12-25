import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import {
  CALLBACK_URL,
  CLIENT_ID,
  CLIENT_SECRETE,
} from "../config/environment.config.js";
import User from "../model/user.model.js";
import crypto from "crypto";
export const setupPassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRETE,
        callbackURL: CALLBACK_URL,
        passReqToCallback: true,
      },
      async function (request, accessToken, _, profile, done) {
        try {
          console.log(done, "done");
          const email = profile.email;
          const userName =
            profile.displayName ||
            profile.given_name ||
            profile.family_name ||
            email;

          let user = await User.findOne({ email });

          if (!user) {
            const randomPassword = crypto.randomBytes(12).toString("hex");
            user = await User.create({
              userName,
              email,
              password: randomPassword,
              enabled_2fa: false,
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
