require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const sharp = require('sharp');
var multerS3 = require('multer-s3-transform')

const options = {
    accessKeyId: process.env.AWS_IAM_USER_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET,
    region: process.env.AWS_REGION
}

const s3Config = new AWS.S3(options);

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        return cb(new Error('Only jpg/jpeg files are allowed'),false)
    }
}

// this is just to test locally if multer is working fine.
// const storage = multer.diskStorage({
//     destination: (req, res, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname)
//     }
// })



const storageResize = multerS3({
    s3: s3Config,
    bucket: `${process.env.AWS_BUCKET_NAME}`,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    ACL: 'public-read',
    shouldTransform: function (req, file, cb) {
        cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [
        {
            id: 'large',
            key: function (req, file, cb) {
                cb(null, new Date().toISOString() + '-' + file.originalname + '-large.jpg')
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize(2048, 2048).jpeg({ quality: 30 }))
            }
        },
        {
            id: 'medium',
            key: function (req, file, cb) {
                cb(null, new Date().toISOString() + '-' + file.originalname + '-medium.jpg')
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize(1024, 1024).jpeg({ quality: 30 }))
            }
        },
        {
            id: 'thumbnail',
            key: function (req, file, cb) {
                cb(null, new Date().toISOString() + '-' + file.originalname + '-thumb.jpg')
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize(300, 300).jpeg({ quality: 30 }))
            }
        }
    ]
});

const upload = multer({
    storage: storageResize,
    fileFilter: fileFilter
})

module.exports = upload;
