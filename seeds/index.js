const mongoose = require("mongoose");
const School = require("../models/schools");
const User = require('../models/users');
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");
mongoose.connect("mongodb://127.0.0.1:27017/ratemyschool");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Hello connection error:"));
db.once("open", () => {
  console.log("Database CONNECTED!");
});

const adminEmail = 'admin@admin.com';
const adminUser = 'admin';
const adminPassword = 'admin';


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

    for (let i = 0; i < 50; i++) {
      const ran1000 = Math.floor(Math.random() * 1000);
      const school = new School({
        location: `${cities[ran1000].city} , ${cities[ran1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: "/img/uni2.jpg",
        tuition: 20000,
        author: admin._id
      });
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
