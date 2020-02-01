var mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	User = require("./models/user"),
	Comment = require("./models/comment");

var data = [{
          name: "Cherry Creek State Park",
          image: "https://www.visitaurora.com/imager/files_idss_com/C151/693ca8fa-4ff0-434c-bfc5-22929831f9ff/3890e01d-6116-45ba-8ada-d926a7c45924_06c0c6a6d9234a48cbd7dc4352fe72e0.jpg",
		price: 9.00,
          description: "Cherry Creek State Park is a state park in Arapahoe County, Colorado, United States. The park consists of a natural prairie and wetland environment with an 880-acre reservoir at its center which is shared by powerboats, sailboats, and paddle craft." 
     },  
     {
          name: "Cloudland Canyon State Park",
          image: "https://photos.smugmug.com/photos/i-c5KKfLM/0/L/i-c5KKfLM-L.jpg",
		 price: 5.00,
          description: "Cloudland Canyon State Park is in northwest Georgia, on the western edge of Lookout Mountain. Boulder-strewn Sitton Gulch Creek cuts a deep gorge into the mountain. Sitton's Gulch Trail runs parallel to the creek. The short, steep Waterfalls Trail, with stairs down into the canyon, leads to Cherokee Falls and Hemlock Falls, where water cascades down into pools. Nearby, Sitton’s Cave has mineral formations."
     },
     {
          name: "Florence Marina State Park",
          image: "https://photos.smugmug.com/photos/i-6wP79b9/0/L/i-6wP79b9-L.jpg",
		 price: 5.00,
          description: "Water sports on a 45,000-acre lake, wildlife watching, nature center & lodging (cottages & camping)."
     }];

function createCampgrounds() {
	data.forEach((seed) => {
		 Campground.create(seed, function(err, campground) {
          if (err) {
               console.log("There was an error adding campground")
               console.log(err);
          } else {
			  console.log("Added campground: " + campground.name);
			  fetchUserAndCreateComment(campground);
              // Add comments after creating
          }
     })
	}) 
};

function createComment(campground, author) {
	Comment.create({
		text: "I loved this place! 10/10!!!",
		author: author
	}, (err, comment) => {
		if (err) {
			console.log(err);
		} else {
			campground.comments.push(comment);
			campground.author = author;
			campground.save();
			console.log("created new comment for " + campground.name);
		}
	})
}

function fetchUserAndCreateComment(campground) {
	User.findOne({}, (err, user) => {
		if (err) {
			console.log("Could not find a user from DB");
			console.log(err);
		} else {
			var author = {
				id: user._id,
				username: user.username
			};
			createComment(campground, author);
		}
	})
}


function removeComments() {
	Comment.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("removed comments!");
		}
	})
}

function seedDB() {
	// Remove all campgrounds
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("removed campgrounds!");
			// Remove all comments
			removeComments();
			// Add a few campgrounds
			createCampgrounds();
		}
	})
};

module.exports = seedDB;