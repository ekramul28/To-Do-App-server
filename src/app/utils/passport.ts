import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../modules/User/user.model";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      passReqToCallback: true, // Allows access to req object
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log(" Access Token:", accessToken);
        console.log(" Refresh Token:", refreshToken);

        // 🔹 Store refreshToken in database for future use
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log(" Existing User Found:", user.email);

          // 🔹 If refreshToken is not received, use the stored one
          if (!refreshToken) {
            refreshToken = user.refreshToken as string;
          }

          // 🔹 Update user with new accessToken & refreshToken if available
          user.accessToken = accessToken;
          if (refreshToken) user.refreshToken = refreshToken;

          await user.save();
        } else {
          console.log("New User! Creating account...");
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            picture: profile.photos?.[0]?.value,
            accessToken,
            refreshToken,
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in Google OAuth:", err);
        return done(err);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
