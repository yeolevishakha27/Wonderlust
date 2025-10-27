const Listing = require("../models/listing");
const Review = require("../models/review");
 
module.exports.createReview = async (req, res) => {
    // console.log("➡ Review body received:", req.body); // should log { rating, comment }
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    // if (!listing) throw new ExpressError(404, "Listing not found");
    // Correctly create review
    // const newReview = new Review(req.body.review);
    // await newReview.save();
    // console.log("✅ Review saved successfully:", newReview);
    // Push ObjectId to listing
    await newReview.save();
   // listing.reviews.push(newReview._id);
    await listing.save();
    //console.log("✅ Listing updated successfully");
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };