const express = require('express')

const engine = require('ejs-mate')
const mongoose = require('mongoose');

const School = require('./models/schools')
const methodOveride = require('method-override')
const path = require('path');
mongoose.connect('mongodb://127.0.0.1:27017/ratemyschool');
const app = express();
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(methodOveride('_method'))
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', engine);

app.use(express.urlencoded({extended: true}))


const db = mongoose.connection;
db.on("error", console.error.bind(console, "Hello connection error:"))
db.once("open", () => {
    console.log("Database CONNECTED!")
})



app.get("/" , ( req, res) => {
  
    res.render("home")
})


app.get('/schools', async (req, res) => {

     const schools = await School.find({})

     res.render('schools/index', {schools})
})


app.get('/schools/new', (req,res) => {
    res.render('schools/new')
})

app.post('/schools', async (req, res) => {
    const {title} =  req.body
    const {location} = req.body
    
    const school = new School({title: title, location: location} )
    await school.save();
    res.redirect(`/schools/${school._id}`)

})


app.get('/schools/:id', async (req, res) => {

    const school = await School.findById(req.params.id)

    res.render('schools/show', {school})
})

app.get('/schools/:id/edit', async (req, res) => {
    const school = await School.findById(req.params.id)
    res.render('schools/edit', {school})

})

app.put('/schools/:id', async (req, res) => {
    const {id} = req.params
    const {title} =  req.body
    const {location} = req.body
    const school = await School.findByIdAndUpdate(id, {title: title , location: location})
    res.redirect(`/schools/${school._id}`) 
  
})





app.delete('/schools/:id', async (req, res) => {
    const {id} = req.params
    await School.findByIdAndDelete(id);
    res.redirect('/schools')
})



app.listen(3000, () => {
    console.log("serving on port 3000")
})