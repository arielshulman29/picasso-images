const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/upload');


router.route('/')
    // .post(isLoggedIn,catchAsync(furniture.createNewRoom))
    .post(upload.array('image'), function (req, res, next) {
        console.log('Uploaded!');
        if (req.files) {
            res.send(req.files);
        }
        else {
            if (req.file) {
                res.send(req.file);
            }
        }
    })

    
module.exports = router;