const Joi = require("joi");
module.exports.schoolSchema = Joi.object({
  school: Joi.object({
    title: Joi.string().required(),
    tuition: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    rating: Joi.number().min(1).max(5).empty(3),
    //description: Joi.string().required()
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().empty(""),
    rating: Joi.number().required().min(1).max(5),
  }),
});
