const mongoose = require("mongoose");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
  title: String,
  image: String,
  tuition: Number,
  // descritption: String,
  rating: Number,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
SchoolSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("School", SchoolSchema);
