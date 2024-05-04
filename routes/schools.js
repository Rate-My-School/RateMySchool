const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const School = require("../models/schools");
const { schoolSchema } = require("../schemas.js");
const { isLoggedIn, isAuthor } = require("../utils/middleware.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")

const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({accessToken: mapBoxToken})




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
    res.render("schools/index", { schools: JSON.stringify(schools) });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("schools/new");
});

router.post(
  "/",
  isLoggedIn,
  schoolValidator,
  wrapAsync(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
      query: req.body.school.location,
      limit: 1
    }).send()
    const school = new School(req.body.school);
    school.geometry = geoData.body.features[0].geometry
    school.author = req.user._id;
    await school.save();
    // console.log(school)
    req.flash("success", "Successfully added a new School!");
    res.redirect(`/schools/${school._id}`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let rate = 0;
    const school = await School.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!school) {
      req.flash("error", "Cannot find school!");
      res.redirect("/schools");
    }

    res.render("schools/show", { school });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
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
  isLoggedIn,
  isAuthor,
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
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await School.findByIdAndDelete(id);
    req.flash("success", "School has been removed!");
    res.redirect("/schools");
  })
);

module.exports = router;
