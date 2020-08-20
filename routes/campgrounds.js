var express     = require("express");
var router = express.Router();	

var Camp = require("../models/camp");
var Comment     = require("../models/comment");

router.get("/", function(req, res){
	res.render("home.ejs"); 
});


	
	router.put("/campground/:id/", function(req, res){ 
		Camp.findById(req.params.id,  req.body.campground ,function(err, updCamp){
			if (err) { 
				console.log(err);
				res.render("/campground", {currentUser: req.user});
			} else { 
				res.redirect("/campground/" + req.params.id)
			}
	});
		});


router.post("/campground", function(req, res){ 
		var name = req.body.name; 
		var image = req.body.image;
		var price = req.body.price;
		var description = req.body.description;
		var author = {
			id : req.user.id,
			username: req.user.username
		}
		var newCampground = {name: name, price: price, image: image, description: description, author: author}; 
	Camp.create(newCampground, function(err, newCamp){
		if(err) {
		console.log(err);
	} else{ 
		res.redirect("/campground");
	} } );
	
});

router.get("/campground", function(req, res){
	Camp.find({}, function(err, camp){
		if(err) {
		console.log(err);
	} else{ 
		res.render("camp.ejs", {campgrounds: camp, currentUser: req.user}); 
	}
	})
	//res.render("camp", {campgrounds: camp}); 
});

router.get("/campground/new", isLoggedIn, function(req, res){
	res.render("new"); 
});

router.get("/campground/:id", function(req, res){
	Camp.findById(req.params.id).populate("comments").exec( function(err, foundCamp){
		if(err) {
			console.log(err);
		} else {
			res.render("show", {campground: foundCamp, currentUser: req.user}); 
		}
	});	
});

/// DELETE Camp 

router.delete("/campground/:id", function(req, res){
	Camp.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campground");
		} else {
			res.redirect("/campground");
		}
	})
}) 
/// Edit Camp 
router.get("/campground/:id/edit",  function(req, res){
	if (req.isAuthenticated()) {
			Camp.findById(req.params.id,  function(err, findCamp){
		if(err){
			req.flash("error", "Didn't find the campground you looking for");
			res.redirect("/campground");
		} else {
			if (findCamp.author.id.equals(req.user.id)) { 
			res.render("edit", {campground: findCamp}); 
				} else { 
					req.flash("error", "Only author ca change that");
					res.redirect("/campground"); } }
		})	;
	}	 else {
		res.send("you need to login")
	}

	});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	res.locals.error = req.flash("error");
	req.flash("error", "Please login");
    res.redirect("/login");
}

function checkCampOwnership(req, res, next){
	if (req.isAuthenticated()) {
			Camp.findById(req.params.id,  function(err, findCamp){
		if(err){
			req.flash("error", "Didn't find the campground you looking for");
			res.redirect("/campground");
		} else {
			if (findCamp.author.id.equals(req.user.id)) { 
			next();
				} else {
			req.flash("error", "Only author ca change that");
			res.redirect("back"); }
		}
			});
						  
		
	} else {
		req.flash("error", "Please login");
		res.redirect("back");
	}};

	

module.exports = router;
