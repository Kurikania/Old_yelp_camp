var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	passport              = require("passport"),
    User                  = require("./models/user"),
	methodOverride = require("method-override"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Camp  = require("./models/camp"),
	Comment     = require("./models/comment"),
	flash = require("connect-flash"),
    seedDB      = require("./seeds")
	

var commentRoutes = require("./routes/comments"); 
var authRoutes = require("./routes/auth");
var campgroundRoutes = require("./routes/campgrounds");

//seedDB(); 
//mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true ,  useUnifiedTopology: true });
mongoose.connect("mongodb+srv://kurikania:front@cluster0.wmpfb.mongodb.net/<yelp_camp>?retryWrites=true&w=majority" , { useNewUrlParser: true ,  useUnifiedTopology: true } );
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); 
app.use(flash());

app.use(require("express-session")({
	secret: "This is anything",
	resave: false, 
	saveUninitialized: false
})) ;

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

///// PASSPORT CONFIG //////



app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes); 


//============================//
//////////////AUTH ROUTES////////


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
/*app.listen(3000, function() { 
      console.log('YelpCamp Server has started'); 
});*/