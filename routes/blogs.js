var express =require("express");
var router = express.Router();
var Blog = require("../models/blog");

function isLoggedIn(req,res,next){
if(req.isAuthenticated())
	return next();
req.flash("error","Please login first");
res.redirect("/login");
}

function checkOwnerOfBlog(req,res,next){
  if(req.isAuthenticated()){
  Blog.findById(req.params.id , function(err,blog){
    if(err)
    {
    console.log(err);
  }
  else {
      if(blog.author.id.equals(req.user._id))
    {
    next();
}
else {
  req.flash("error","You are not the owner of the blog");
  res.redirect("back");
}
    }
  });
}
else
{ req.flash("error","Login first");
  res.redirect("back");
}
}

router.get("/",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
				req.flash("error","Something went wrong");
			console.log("error");
		}else{
			res.render("blogs",{blogs:blogs});
		}
	})
})

router.post("/",isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author={
		id : req.user._id,
		username : req.user.username
	}
	var newBlog = {name: name , image : image , description :desc,author:author};
	Blog.create(newBlog,function(err,newBlog){
		if(err){
				req.flash("error","Something went wrong");
			console.log("error");
		}else{

			console.log(newBlog);
		}
	})
		req.flash("success","Blog created Successfully");
	res.redirect("/blogs");
})

router.get("/new",isLoggedIn,function(req,res){
	res.render("new");
})

router.get("/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
		if(err){
			console.log("error");
		}else{
			res.render("show",{blog:foundBlog});
		}
	})
})

router.get("/:id/edit",checkOwnerOfBlog,function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
				req.flash("error","Something went wrong");
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	})
})

router.put("/:id",checkOwnerOfBlog,function(req,res){
  Blog.findByIdAndUpdate(req.params.id ,req.body.blog,function(err,Updatedblog){
    if(err){
				req.flash("error","Something went wrong");
      res.redirect("/blogs");
    }
    else {
			req.flash("success","Blog updated successfully");
    res.redirect("/blogs/"+req.params.id);
    }
  });
});

router.delete("/:id",checkOwnerOfBlog,(req, res) => {
Blog.findByIdAndRemove(req.params.id, err => {
    if (err) { res.redirect("/blogs"); }
    else {
				req.flash("success","Blog deleted successfully");
      res.redirect("/blogs"); }
  });
})

module.exports = router;
