const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc    Auth with github
// @route   GET /auth/github
router.route('/')
  .post(passport.authenticate('github'))
  .get(passport.authenticate('github'))

// @desc    github auth callback
// @route   post /auth/github/callback
router.route('/callback')
  .post(passport.authenticate('github', { failureRedirect: '/auth/github/failed' }),
    (req, res) => {
      res.redirect('/')
    }
  )
  .get(passport.authenticate('github', { failureRedirect: '/auth/github/failed' }),
    (req, res) => {
      res.redirect('/')
    }
  )

// @desc    Failed login
// @route   /auth/logout
router.route('/failed')
  .post((req, res, err) => {
    res.status('401').send('Authentication failed', err);
  })
  .get((req, res, err) => {
    res.status('401').send('Authentication failed', err);
  })

module.exports = router