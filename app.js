const express = require("express");
const app= express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground=require("./models/campground");
const Comment= require("./models/comment");
// const User = require("./models/user");
// const deleteDb = require("./seed");
// deleteDb(); 
mongoose.connect("mongodb+srv://secret",{ useNewUrlParser: true ,useUnifiedTopology: true,});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static("public"))



app.get('/',(req,res)=>{
    res.render("landing");

})
app.get('/campground',(req,res)=>{
   Campground.find({},(err,campground)=>{
       if(err)
       {
           console.log(err);
       }
       else{
           console.log("data reteirved successfully ")

            res.render("campground/camping",{campground:campground});
       }
   }) 

})

app.post('/campground',(req,res)=>{
    const place_name=req.body.name;
    const place_image=req.body.image;
    const place_description= req.body.description;
    const create={
        name:place_name,
        image:place_image,
        description:place_description
    }
    Campground.create(create,(err,newone)=>
    {
        if(err)
        console.log("Something went wrong ");
        else
        {
            console.log("Data is created successfully ");
            res.redirect('/campground');
        }
    })

})

//New show form to create new campground
app.get('/campground/new',(req,res)=>
{
    res.render("campground/new")

})

app.get('/campground/:id',(req,res)=>
{   //find the id then render the show page with id
    Campground.findById(req.params.id).populate("comments").exec((err,campground)=>{
        if(err)
        console.log(err);
        else
        {
               // console.log(campground);
        res.render("campground/show",{campground:campground});
        }
    }
    )
})
app.get("/campground/:id/comments/new",(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
                if(err)
                console.log(err);
                else
                res.render("comment/new",{campground:campground});

    })
}
);

app.post("/campground/:id/comments",(req,res)=>{
     Campground.findById(req.params.id,(err,campground)=>{
            if(err)
            console.log(err);
            else{
                const content=req.body.content;
                const author=req.body.author;
                const comment={
                    author:author,
                    content:content
                };
            Comment.create(comment,(err,comment)=>{
                if(err)
                console.log(err)
                else{
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campground/${campground._id}`);
                }
            })
            }
     })
})
const PORT = 8000
app.listen(PORT,()=>{

console.log(`server running on port ${PORT}
Welcome to Yelpcamp`);

})
