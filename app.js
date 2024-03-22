const express = require('express')

const engine = require('ejs-mate')
const mongoose = require('mongoose');
const Joi = require('joi')
const School = require('./models/schools')
const Review = require('./models/reviews')
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/wrapAsync')
const { schoolSchema, reviewSchema } = require('./schemas.js')
const methodOveride = require('method-override')
const path = require('path');
mongoose.connect('mongodb://127.0.0.1:27017/ratemyschool');
const app = express();
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(methodOveride('_method'))
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', engine);

app.use(express.urlencoded({ extended: true }))


const db = mongoose.connection;
db.on("error", console.error.bind(console, "Hello connection error:"))
db.once("open", () => {
    console.log("Database CONNECTED!")
})



app.get("/", (req, res) => {

    res.render("home")
})


app.get('/schools', wrapAsync(async (req, res) => {

    const schools = await School.find({})

    res.render('schools/index', { schools })
}))


app.get('/schools/new', (req, res) => {
    res.render('schools/new')
})


const schoolValidator = (req, res, next) => {

    const { error } = schoolSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 404)
    } else {
        next()
    }
}

const reviewValidator = (req, res, next) => {
    console.log(req.body)
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 404)
    } else {
        next()
    }
}

app.post('/schools', schoolValidator, wrapAsync(async (req, res) => {
    const school = new School(req.body.school)
    await school.save();
    res.redirect(`/schools/${school._id}`)
}))

app.get('/schools/:id', wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id).populate('reviews')
    console.log(school)
    res.render('schools/show', { school })
}))

app.get('/schools/:id/edit', wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id)
    res.render('schools/edit', { school })
}))

app.put('/schools/:id', schoolValidator, wrapAsync(async (req, res) => {
    const { id } = req.params
    const school = await School.findByIdAndUpdate(id, { ...req.body.school })
    res.redirect(`/schools/${school._id}`)
}))
app.post('/schools/:id/reviews', reviewValidator, wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id)
    const review = new Review(req.body.review)
    school.reviews.push(review)
    await review.save()
    await school.save()
    res.redirect(`/schools/${school._id}`)

}))
app.delete('/schools/:id/reviews/:reviewId', wrapAsync(async (req, res) => {

    const school = await School.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } })
    const review = await Review.findByIdAndDelete(req.params.reviewId)
    res.redirect(`/schools/${school._id}`)
}))

app.delete('/schools/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    await School.findByIdAndDelete(id);
    res.redirect('/schools')
}))
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something Went Wrong"
    res.status(statusCode).render('error', { err })

})

app.listen(3000, () => {
    console.log("serving on port 3000")
})