var express = require("express"),
	router = express.Router({mergeParams: true}),
	middleware = require("../middleware"),
	Campground = require("../models/campground"),
	Comment = require("../models/comment");

router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("comments/new", {campground:campground});
		}
	})
})

router.post("/", middleware.isLoggedIn, (req, res) => {
	// look up campground by ID
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash("error", "Something went wrong.");
					res.redirect("/campgrounds");
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// console.log(comment);
					req.flash("success", "Successfully added comment.");
					// redirect to show page
					res.redirect("/campgrounds/" + campground._id);
				}
				
			})
			
		}
	})
	
})

// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentUser, (req, res) => {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
	})
	Comment.findById(req.params.comment_id, function(err, comment) {
		if (err) {
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			res.render("comments/edit.ejs", {
				campground_id: req.params.id,
				comment: comment
			});
		}
	})
})

// COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentUser, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
	})
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// COMMENTS DELETE ROUTE
// DESTROY - CAMPGROUND ROUTE
router.delete("/:comment_id", middleware.checkCommentUser, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" +req.params.id);
		}
	})
})


module.exports = router;
