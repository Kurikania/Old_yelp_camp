var express     = require("express");
var router = express.Router();
var Camp = require("../models/camp");
var Comment     = require("../models/comment");
var passport              = require("passport");
var User                  = require("../models/user");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
	

router.get("/campground/:id/comments/new", isLoggedIn, function(req, res){ 
		Camp.findById(req.params.id, function(err, foundCamp){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCamp, currentUser: req.user}); 
		}		
});
}); 

router.post("/campground/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Camp.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campground");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author.id = req.user._id;
               comment.author.username = req.user.username;
			   comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campground/' + campground._id);
           }
        });
       }
   });
});

router.get("/campground/:id/comments/:comment_id/edit", function(req, res){
	
	Comment.findById(req.params.comment_id, function(err, findComment){
		if (err){
			console.log(err)
		} else {
			res.render("comments/edit",{comment: findComment, campground: req.params.id, currentUser: req.user})
		}
	})

	
});

router.put("/campground/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updComment){
		if (err) {
			console.log(err) 
		} else {
			redirect("campground/"+req.params.id)
		}
	})
} );

router.delete("/campground/:id/comments/:comment_id",  function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect(req.params.id);
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("back");
		}
	})
});
		   
		   
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please login");
    res.redirect("/login");
};

function checkCommentOwnership(req, res, next){
	if (req.isAuthenticated()) {
			Comment.findById(req.params.comment_id,  function(err, findComment){
		if(err){
			req.flash("error", "Didn't find the comment you looking for");
			res.redirect("/campground");
		} else {
			if (findComment.author.id.equals(req.user.id)) { 
			next();
				} else {
				req.flash("error", "Only author can do that");
				res.redirect("back"); } }
		}	);	
	} else {
		res.redirect("back");
	}};

module.exports = router;
