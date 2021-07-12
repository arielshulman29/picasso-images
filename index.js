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
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', imageRoutes)

app.use('/auth/github', githubOauthRoutes)


app.all('*', (req, res, next) => {
    res.status(404).send('Page Not Found')
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`serving on port ${port}`);
})