var express     = require("express");
var router = express.Router();	;

var passport              = require("passport");
var User                  = require("../models/user");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
	
router.get("/register", function(req, res){
	res.render("register");
})

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err); 
			req.flash("error", err.message);
			return res.render("register"); 
			}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campground"); 
		})
	})
});

router.get("/login", function(req, res){
	res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campground",
	failureRedirect: "/login"
}), function(req, res){
	
}); 

router.get("/logout", function(req, res){
	req.logout();
	res.locals.error = req.flash("error");
	req.flash("error", "Logged you out");
	res.render("home");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please login");
    res.redirect("/login");
}

module.exports = router;