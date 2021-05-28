var express =require("express");
var router = express.Router({mergeParams:true});
var Blog = require("../models/blog");
var Comment = require("../models/comment");

	function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	req.flash("error","Please login first");
	res.redirect("/login");
}
function checkOwnerOfComment(req,res,next){
  if(req.isAuthenticated()){
  Comment.findById(req.params.comment_id , function(err,comment){
    if(err)
    {
				req.flash("error","Comment not found");
    console.log(err);
  }
  else {
      if(comment.author.id.equals(req.user._id))
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
{ req.flash("error","Please login first");
  res.redirect("back");
}
}

router.get("/new",isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
				req.flash("error","Blog not found");
			console.log("error");
		}else{
			res.render("comments/new",{blog:blog});
		}
	})
})
router.post("/",isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
				req.flash("error","Blog not found");
			res.redirect("/blogs");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
						req.flash("error","Something went wrong");
					console.log("error");
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					console.log(comment);
					blog.comments.push(comment);
					blog.save();
						req.flash("success","Comment created successfully");
					res.redirect("/blogs/" + blog._id);
				}
			})
		}
	})
})

router.get("/:comment_id/edit",checkOwnerOfComment,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
				req.flash("error","Something went wrong");
			res.redirect("back");
		}else{
					res.render("comments/edit",{blog_id:req.params.id,comment:foundComment});
		}
	})
})

router.put("/:comment_id",checkOwnerOfComment,function(req,res){

Comment.findByIdAndUpdate(req.params.comment_id ,req.body.comment,function(err,Updatedblog){
    if(err){
				req.flash("error","Something went wrong");
      res.redirect("/blogs");
    }
    else {
				req.flash("success","Comment updated successfully");
    res.redirect("/blogs/"+req.params.id);
    }
  });
});

router.delete("/:comment_id",checkOwnerOfComment,(req, res) => {
Comment.findByIdAndRemove(req.params.comment_id, err=> {
    if (err) {
			req.flash("error","Something went wrong");
			res.redirect("/blogs"); }
    else {
			req.flash("success","Comment deleted successfully");
      res.redirect("/blogs/"+req.params.id); }
  });
})

module.exports = router
