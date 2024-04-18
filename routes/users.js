const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { storeReturnTo } = require("../utils/middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to RateMySchool!");
        res.redirect("/schools");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.returnTo || "/schools";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/schools");
  });
});

module.exports = router;
