const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// 🆕 Route to filter by category
router.get("/category/:category", wrapAsync(async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings, category });
}));
// const validateListing = (req,res,next) =>{
//   let {error} = listingSchema.validate(req.body.listing);
//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }else{
//     next();
//   }
// };
// const validateListing = (req,res,next) =>{
//   // 💡 FIX: Pass the entire request body to the schema.
//   // The schema must be expecting the top-level 'listing' key.
//   let {error} = listingSchema.validate(req.body); 

//   if(error){
//     // Use .details to extract the specific error messages from Joi
//     let errMsg = error.details.map((el) => el.message).join(", "); 
//     throw new ExpressError(400, errMsg);
//   }else{
//     next();
//   }
// };

router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn, 
  upload.single("listing[image]"),
  validateListing,
  wrapAsync (listingController.createListing)
);

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync (listingController.destroyListing));




//Index Route
//router.get("/",wrapAsync(listingController.index));

//New Route
// router.get("/new",isLoggedIn,listingController.renderNewForm);

//Show Route
// router.get(
//   "/:id", 
//   wrapAsync(listingController.showListing));

//Create Route
// router.post(
//   "/",
//   isLoggedIn, 
//   validateListing,
//   wrapAsync (async (req, res, next) => {
//   let result = listingSchema.validate(req.body);
//   console.log(result);

//   if(result.error){
//     throw new ExpressError(400, result.error);
//   }
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id; 
//   await newListing.save();

//   req.flash("success","New Listing Created!");
//   res.redirect("/listings");
// })
// );
//Create Route
// router.post(
//   "/",
//   isLoggedIn, 
//   validateListing,
//   wrapAsync (listingController.createListing)
// );

//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm));

//Update Route
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

//Delete Route
// router.delete("/:id", 
//   isLoggedIn,
//   isOwner,
//   wrapAsync (listingController.destroyListing));

module.exports = router;