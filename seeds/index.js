const mongoose = require("mongoose");
const School = require("../models/schools");
const User = require('../models/users');
// const { places, descriptors } = require("./seedHelpers");
// const cities = require("./cities");
mongoose.connect("mongodb://127.0.0.1:27017/ratemyschool");
const schoolData = require('../data/schoolSchema.json')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Hello connection error:"));
db.once("open", () => {
  console.log("Database CONNECTED!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  try {
    await School.deleteMany({});
    await User.deleteMany({});

    const adminEmail = 'admin@ratemyschool.com';
    const adminUser = 'RateMySchool';
    const adminPassword = 'admin';

    const admin = new User({ username: adminUser, email: adminEmail, role: 'admin' });
    await admin.setPassword(adminPassword);
    await admin.save();
    console.log('Admin user created successfully');

    for (let i = 0; i < schoolData.length; i++) {
      const school = new School(schoolData[i]);
      await school.save();
    }
  }
  catch (e) {
    console.log('Error seeding database:', e)
  }
  finally {
    // Disconnect from MongoDB after seeding
    mongoose.disconnect();
  }
}

seedDB();
