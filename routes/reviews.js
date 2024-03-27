const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const School = require("../models/schools");
const Review = require("../models/reviews");
const { reviewSchema } = require("../schemas.js");

const reviewValidator = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

router.post(
  "/",
  reviewValidator,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const school = await School.findById(req.params.id);
    const review = new Review(req.body.review);

    school.reviews.push(review);

    await review.save();
    await school.save();
    req.flash("success", "Created new review!");
    res.redirect(`/schools/${school._id}`);
  })
);
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const school = await School.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/schools/${school._id}`);
  })
);

module.exports = router;
