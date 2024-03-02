const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const SchoolSchema = new Schema({
    title: String,
    image: String,
    tuition: Number,
    descritption: String,
    location: String

})


module.exports = mongoose.model("School", SchoolSchema)