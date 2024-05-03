const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const School = require("../models/schools");
const Review = require("../models/reviews");
const { reviewSchema } = require("../schemas.js");
const { isLoggedIn, isReviewAuthor, isAdmin } = require("../utils/middleware.js");

const reviewValidator = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

const findUserReviews = async (req, res, next) => {
  const { id } = req.params
  const school = await School.findById(id).populate({ path: "reviews" });
  console.log(school)
  let exists = false
  for (let i = 0; i < school.reviews.length; i++) {
    if ((school.reviews[i].author.equals(req.user._id)) && (!req.user.isAdmin)) {
      exists = true
      console.log("USER ALREADY HAS REVIEW")
      req.flash("error", "You already have a review! Please delete your current one to post another!");
      return res.redirect(`/schools/${school._id}`);
    }

  }
  next();
}

router.post(
  "/",
  isLoggedIn,
  reviewValidator,
  findUserReviews,
  wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id).populate({ path: "reviews" });
    const review = new Review(req.body.review);

    let rate = 0
    review.author = req.user._id;
    school.reviews.push(review);
    school.reviews.forEach(n => {
      rate += Number(n.rating)
    })
    school.rating = Math.round((rate / school.reviews.length) * 10) / 10
    await review.save();
    await school.save();
    req.flash("success", "Created new review!");
    res.redirect(`/schools/${school._id}`);
  })
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let rate = 0
    await School.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    const school = await School.findById(req.params.id).populate({ path: "reviews" });
    if (school.reviews.length > 0) {
      console.log('IN')
      school.reviews.forEach(n => {
        rate += Number(n.rating)
      })
      school.rating = Math.round((rate / school.reviews.length) * 10) / 10
    }
    else {
      school.rating = 0
    }
    school.save()
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/schools/${school._id}`);
  })
);

module.exports = router;
