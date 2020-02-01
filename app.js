var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");
	
// requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect(process.env.DATABASEURL, { 
     useNewUrlParser: true, 
	useUnifiedTopology: true}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR:", err.message);
});

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.set('useFindAndModify', false);

// seedDB(); // seed the database

// PASSPORT configuration
app.use(require("express-session")({
	secret: "Who are you? Come find out!",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// needed for header.ejs to get the current user
// every function will call this middleware
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Use the routes in the application
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, () => {
     console.log("YelpCamp server is on!!!");
});
