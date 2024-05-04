const express = require("express");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const methodOveride = require("method-override");
const path = require("path");
mongoose.connect("mongodb://127.0.0.1:27017/ratemyschool");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/users.js");
const passport = require("passport");
const localStrategy = require("passport-local");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", engine);

app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.use(express.static("public"));

const userRoutes = require("./routes/users.js");
const schoolRoutes = require("./routes/schools.js");
const reviewRoutes = require("./routes/reviews.js");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Hello connection error:"));
db.once("open", () => {
  console.log("Database CONNECTED!");
});

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,

  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (req.user) {
    req.user.isAdmin = req.user.role === 'admin';
  }
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/map", (req, res) => {
  res.render("map");
});

app.use("/", userRoutes);
app.use("/schools", schoolRoutes);
app.use("/schools/:id/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
