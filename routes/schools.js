const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const School = require("../models/schools");
const { schoolSchema } = require("../schemas.js");

const schoolValidator = (req, res, next) => {
  const { error } = schoolSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const schools = await School.find({});
    res.render("schools/index", { schools });
  })
);

router.get("/new", (req, res) => {
  res.render("schools/new");
});

router.post(
  "/",
  schoolValidator,
  wrapAsync(async (req, res) => {
    const school = new School(req.body.school);
    await school.save();
    req.flash("success", "Successfully added a new School!");
    res.redirect(`/schools/${school._id}`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id).populate("reviews");
    if (!school) {
      req.flash("error", "Cannot find school!");
      res.redirect("/schools");
    }
    res.render("schools/show", { school });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id);
    if (!school) {
      req.flash("error", "Cannot find school!");
      return res.render("/schools");
    }
    res.render("schools/edit", { school });
  })
);

router.put(
  "/:id",
  schoolValidator,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndUpdate(id, { ...req.body.school });
    req.flash("success", "School has been edited!");
    res.redirect(`/schools/${school._id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await School.findByIdAndDelete(id);
    eq.flash("success", "School has been removed!");
    res.redirect("/schools");
  })
);

module.exports = router;
