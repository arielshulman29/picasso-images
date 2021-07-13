if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const imageRoutes = require('./routes/images')
const githubOauthRoutes = require('./routes/githubOauth')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const connectDB = require('./config/db-config')
const ExpressError=require('./utils/ExpressError')

// Passport Oauth2 config
require('./config/passport-config')(passport)

//db config
connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//for local tests
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxDate: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', imageRoutes)

app.use('/auth/github', githubOauthRoutes)

app.all('*',(req, res, next) => {
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message='something went wrong';
    res.status(err.statusCode).json({'error': err.message });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`serving on port ${port}`);
})