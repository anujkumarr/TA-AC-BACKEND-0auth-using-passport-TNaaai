var passport = require('passport');
var User = require('../model/User');
var GitHubStrategy = require('passport-github').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: 'bec998bb8b3a79492ec3',
      clientSecret: '4e1a4b31e35fe5bfd4ff17dce0d4b8239b3ecbd5',
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.bio,
        photo: profile._json.avatar_url,
      };

      User.findOne({ 'profileData.username': profile.username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            return done(null, addedUser);
          });
        } else {
         return done(null, user);
        }
      });
    }
  )
);

//google startegy

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        photo: profile._json.picture,
      };

      User.findOne({ 'profileData.email': profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addeduser) => {
            if (err) return done(err);
            return done(null, addeduser);
          });
        } else {
         return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, 'name  uesrname email photo', function (err, user) {
    done(err, user);
  });
});
