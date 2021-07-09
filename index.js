if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
// const methodOverrride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const imageRoutes = require('./routes/images');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//for local tests
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', imageRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('error', { err });
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`serving on port ${port}`);
})