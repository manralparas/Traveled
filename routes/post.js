const express= require('express');
const router = express.Router(); 
const Post=require("../models/post");
const middleware = require("../middleware")
const fs = require('fs');
const path = require('path');


const multer = require('multer'); 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage }).single("image");




router.get('/post/new',middleware.isLoggedIn,(req,res)=>
{
    res.render("post/new")

})
router.get('/share',middleware.isLoggedIn,(req,res)=>
{

    res.render("login");
})
router.get('/post/:id',(req,res)=>
{   //find the id then render the show page with id
    Post.findById(req.params.id).populate("comments").exec((err,post)=>{
        if(err)
        console.log(err);
        else
        {
        res.render("post/show",{post:post});
        }
    }
    )
})

router.get('/post',(req,res)=>{
  Post.find({},(err,post)=>{
       if(err)
       {
           console.log(err);
       }
       else{
            res.render("post/explore",{post:post});
       }
   }) 

})

router.post('/post',(req,res)=>{

    upload(req, res, function (err) {
    if (err) {
        console.log(err)
      return
    }
    const placeName=req.body.name;
    const placeDescription= req.body.description;
    const author={
        id:req.user._id,
        username:req.user.username,
    }
    const create={
        name:placeName,
        image:req.file.filename,
        description:placeDescription,
        author:author
    };
    Post.create(create,(err,newone)=>
    {
        if(err)
        console.log(err);
        else
        {   req.flash("success","post created successfully");
            res.redirect('/post');
        }
    })

})
});
//Edit Route
router.get("/post/:id/edit",middleware.isValidUser,(req,res)=>{
            Post.findById(req.params.id,(err,found)=>{
                if(err)
                console.log(err);
            res.render("post/edit",{post:found});
            })

});
//Delete Route
router.delete("/post/:id",middleware.isValidUser,(req,res)=>{
    Post.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        console.log(err);
        else{
            req.flash("success","post deleted successfully")
            res.redirect("/post");
        }
    })
})

//Update route
router.put("/post/:id",middleware.isValidUser,(req,res)=>{
                const updatedPost = {
                    name:req.body.name,
                    description:req.body.description
                };
                console.log(updatedPost);
                
            Post.findByIdAndUpdate(req.params.id,updatedPost,(err,updatedPost)=>{
            if(err)
            console.log(err);
            else
            {                  
                req.flash("success","Post updated Successfully")
                                
                res.redirect("/post/"+req.params.id);

            }
                
            
        })
});



//to check if user have permission
module.exports=router;