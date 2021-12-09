var passport = require('passport');
var User = require('../model/User');
var GitHubStrategy = require('passport-github').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);

      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.bio,
        photo: profile._json.avatar_url,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return cb(err);
        if (!user) {
          User.create(profileData, (err, addeduser) => {
            if (err) return cb(err);
            return cb(null, addeduser);
          });
        }
        cb(null, user);
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
    (accessToken, refreshToken, profile, cb) => {
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.bio,
        photo: profile._json.avatar_url,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return cb(err);
        if (!user) {
          User.create(profileData, (err, addeduser) => {
            if (err) return cb(err);
            return cb(null, addeduser);
          });
        } else {
          cb(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, 'name email uesrname photo', function (err, user) {
    done(err, user);
  });
});
