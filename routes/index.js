var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	middleware = require("../middleware"),
	User = require("../models/user");

// root route
router.get("/", (req, res) => {
     res.render("landing");
});


// AUTH ROUTES
//-------------------

// show registration form
router.get("/register", function(req, res) {
	res.render("register");
})

// handle sign-up logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("back");
		}else {
			passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome " +req.body.username +". You've successfully created an account.");
			res.redirect("/campgrounds");
		})
		}
	})
})

// show login form
router.get("/login", function(req, res) {
	res.render("login");
})

// handle sign-in logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {	
});


router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You successfully logged out!");
	res.redirect("/campgrounds");
})

router.get("*", (req, res) => {
	res.send("Page not found....");
})

module.exports = router;
