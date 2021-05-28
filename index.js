var express =require("express");
var app = express();
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Blog = require("./models/blog");
var Comment = require("./models/comment");
var User = require("./models/user");
var indexRoutes = require("./routes/index");
var blogRoutes = require("./routes/blogs");
var commentRoutes = require("./routes/comments");

mongoose.connect('mongodb://127.0.0.1/blog', { useNewUrlParser: true } , function(err, db) {
 if (err) {
		 console.log('Unable to connect to the server. Please start the server. Error:', err);
 } else {
		 console.log('Connected to Database  Server successfully!');
 }
});
   app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(require("express-session")({
	secret: "Prerna is the best",
	resave: false,
	saveUninitialized: false
}))

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
	next();
});


app.use("/",indexRoutes);
app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);


app.listen(process.env.PORT||27017,function(){
	console.log("yes");
})
