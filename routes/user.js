const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/users.js");


router
.route("/signup")
.get(usercontroller.renderSignupForm)
.post(wrapAsync(usercontroller.signup));

// router.get("/signup",
//     usercontroller.renderSignupForm);

// router.post("/signup",
//     wrapAsync(usercontroller.signup));

router
.route("/login")
.get(usercontroller.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", { 
    failureRedirect: "/login", 
    failureFlash: true,
}),
usercontroller.login
);

 
// router.get("/login",
//     usercontroller.renderLoginForm);

// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", { 
//     failureRedirect: "/login", 
//     failureFlash: true,
// }),
// usercontroller.login
// );

router.get("/logout",usercontroller.logOut);
module.exports = router;