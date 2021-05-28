var express =require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/",function(req,res){
	res.render("landing");
})

router.get("/register",function(req,res){
	res.render("register");
})

router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log("error");
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Hi " + req.user.username + ", Welcome");
			res.redirect("/blogs");
		})
	});
})

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/blogs",
		failureRedirect:"/login"
	}),function(req,res){
		req.flash("success","Hi " + req.user.username + ",Good to see you again");
})

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Successfully logged out");
	res.redirect("/blogs");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
		req.flash("error","Please login first");
	res.redirect("/login");
}

module.exports = router;
