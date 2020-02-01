var Comment = require("../models/comment"),
	Campground = require("../models/campground");

// all of the middleware goes here
var middlewareObj = {};

//middleware to check user authorization for campground editing/deleting
middlewareObj.checkCampgroundUser = function(req, res, next) {
	if (req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err || !foundCampground) {
				req.flash("error", "Comment not found.");
				res.redirect("back");
			} 
			else {
				// Does user own campgrond?
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		})
		
	} else {
		res.redirect("back");
	}
}

//middleware to check user authorization for comment editing/deleting
middlewareObj.checkCommentUser = (req, res, next) => {
	if (req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err || !foundComment) {
				req.flash("error", "Comment not found.");
				res.redirect("back");
			} else {
				// Does user own comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		})
		
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

//middleware to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}

module.exports = middlewareObj