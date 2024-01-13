if(process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');

const dbUrl = 'mongodb://127.0.0.1:27017/campamentosTAD';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!")
        console.log(err)
    })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/campgrounds', campgroundRoutes);

app.get('/', (req, res) => {
    res.redirect('/campgrounds/index')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})