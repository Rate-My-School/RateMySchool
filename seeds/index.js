

const mongoose = require('mongoose');
const School = require('../models/schools')
const {places, descriptors} = require("./seedHelpers")
const cities = require('./cities')


const schoolJson = require('../data/schoolSchema.json')


mongoose.connect('mongodb://127.0.0.1:27017/ratemyschool');




const db = mongoose.connection;
db.on("error", console.error.bind(console, "Hello connection error:"))
db.once("open", () => {
    console.log("Database CONNECTED!")
})

const sample = (array) => array[Math.floor(Math.random()* array.length)]
const seedDB = async () => {
    await School.deleteMany({})
    for (let i = 0; i < schoolJson.length; i++){
        const ran1000 = Math.floor(Math.random() * 1000)
       const school = new School (
        schoolJson[i]

       )
        school.save()
    }

 
 
}





seedDB()