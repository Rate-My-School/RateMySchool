const ExpressError = require("./ExpressError.js");
const { schoolSchema, reviewSchema } = require("../schemas.js");
const School = require("../models/schools.js");
const Review = require("../models/reviews.js");

module.exports.isAdmin = (req, res, next) => {

}

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const { id } = req.params;
    if (req.originalUrl = `/schools/${id}/reviews`) {
      req.session.returnTo = `/schools/${id}`
    } else {
      req.session.returnTo = req.originalUrl;
    }
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const school = await School.findById(id);
    if (!school) {
      req.flash("error", "School not found");
      return res.redirect("/schools");
    }
    if (req.user && (school.author.equals(req.user._id) || req.user.isAdmin)) {
      // If the user is the author of the school or is an admin, allow access
      return next();
    } else {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/schools/${school._id}`);
    }
  } catch (error) {
    console.error("Error checking authorship:", error);
    req.flash("error", "Something went wrong");
    res.redirect("/schools");
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/schools/${id}`);
    }

    if (req.user && (review.author.equals(req.user._id) || req.user.isAdmin)) {
      // If the user is the author of the review or is an admin, allow access
      return next();
    } else {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/schools/${id}`);
    }
  } catch (error) {
    console.error("Error checking authorship:", error);
    req.flash("error", "Something went wrong");
    res.redirect(`/schools/${id}`);
  }
};
