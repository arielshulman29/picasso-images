const passport = require('passport')
const mongoose = require('mongoose')
const User = require('../models/User')
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = function (passport) {

  passport.serializeUser((user, done) => {
    console.log('user id:', user.id)
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })


  passport.use(new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback'
    },
    async function (accessToken, refreshToken, profile, cb) {
      await User.findOrCreate(
        {
          githubId: profile.id,
          name: profile.displayName,
          username: profile.username,
          profileUrl: profile.profileUrl
        },
        function (err, user) {
          return cb(err, user);
        });
    }
  )
  )

}