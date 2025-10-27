const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./Schema.js");
const {reviewSchema} = require("./Schema.js");


module.exports.isLoggedIn = (req, res, next) =>{
  console.log(req.user);
   if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//validatelisting
module.exports.validateListing = (req,res,next) =>{
  // 💡 FIX: Pass the entire request body to the schema.
  // The schema must be expecting the top-level 'listing' key.
  let {error} = listingSchema.validate(req.body); 

  if(error){
    // Use .details to extract the specific error messages from Joi
    let errMsg = error.details.map((el) => el.message).join(", "); 
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};

//ValidateReview
module.exports.validateReview = (req,res,next) =>{
  //  if (req.body.review && req.body.review.rating) {
  //   req.body.review.rating = Number(req.body.review[rating]);
  // }
    if (req.body.review) {
    // Convert rating safely
    let rating = Number(req.body.review.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      // default to 1 if invalid or missing
      rating = 1;
    }
    req.body.review.rating = rating;
    console.log("Converted rating:", req.body.review.rating, typeof req.body.review.rating);
  }

  let {error} = reviewSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  
    next();
  
  };
