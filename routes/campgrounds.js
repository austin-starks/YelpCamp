var express = require("express"),
	router = express.Router(),
	middleware = require("../middleware"),
	Campground = require("../models/campground");


// INDEX ROUTE - display a list of all campgrounds
router.get("/", (req, res) => {
     // Get all campgrounds from DB
     Campground.find({}, (err, allCampgrounds) => {
          if (err) {
               console.log("There was an error finding campgrounds...")
               console.log(err);
     }    else {
               res.render("campgrounds/index", {campgrounds: allCampgrounds});
     }
     });
});

// NEW ROUTE - show form to make enew campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
     res.render("campgrounds/new");
})

// CREATE ROUTE - add new campground to database
router.post("/", middleware.isLoggedIn, (req, res) => {
     var name = req.body.newCampground;
     var url = req.body.imageURL;
	 var price = req.body.price;
     var desc = req.body.description;
	 var author = {
		id: req.user._id,
		username: req.user.username
	};
     var newCamp = {name: name, image: url, price: price, description: desc, author: author};
     // Create new campground and add to database
     Campground.create(newCamp, (err, newlyCreated) => {
          if (err) {
               console.log("There was an error adding campground")
               console.log(err);
          } else {
               res.redirect("/campgrounds");
          }
     })
});


// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
     // find the campground with provided id
     var id = req.params.id;
     Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
          if (err || !foundCampground) {
			  req.flash("error", "Campground not found");
			  res.redirect("back");
          } else {
			  // console.log(foundCampground);
			  res.render("campgrounds/show", {
				   campground: foundCampground});
          }
     })
});

// EDIT - CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundUser, (req, res) => {
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
})

// UPDATE - CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundUser, (req, res) => {
	// find and update the campground
	// redirect
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
		if (err || !updatedCamp) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// DESTROY - CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundUser, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground deleted.");
			res.redirect("/campgrounds");
		}
	})
})


module.exports = router;