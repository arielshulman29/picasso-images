const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require('../utils/upload');
const { isLoggedIn } = require('../middleware')


router.route('/')
    // .post(isLoggedIn, upload.array('image'), function (req, res, next) {
    .post(upload.array('image'), function (req, res, next) {
        res.status(201).json(
            {
                message: "Files uploaded successfully!",
                thumb: `${{ ...req.files[0] }.transforms[0].location}`,
                medium: `${{ ...req.files[0] }.transforms[1].location}`,
                large: `${{ ...req.files[0] }.transforms[2].location}`
            })
    })
        .get(isLoggedIn, (req, res) => {
            res.send(`${req.user.username} is logged in`)
        })


        module.exports = router;