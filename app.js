//Imports
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const express = require("express"),
    app= express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    flash= require('connect-flash'),
    passport = require("passport"),
    User = require("./models/user"),
    localStrategy=require("passport-local");
const postRoutes=require("./routes/post");
const commentRoutes=require("./routes/comments");
const authRoutes=require("./routes/index");
const methodOverride= require('method-override');
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------Mongo Secret DNS Seed List--------------------------------------------------------------------------------------------
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.KEY,{ useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false });
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static("uploads"))
app.use(methodOverride("_method"));
app.use(flash());
//------------------------------------------------------------------------------------------------------------------

//Passport JS Configuration
app.use(require("express-session")({
    secret:"SECRET_KEY",
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error =   req.flash('error');
  res.locals.success =   req.flash('success');
  next();
});


//-------------------------------------------------------------------------------------------------------------------------
//                                HANDLING ROUTES
app.use(postRoutes);
app.use(commentRoutes);
app.use(authRoutes);

//--------------------------------------------------------------------------------------------------------------------------------- 
//Serving App 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{

console.log(`Server running on port http://localhost:${PORT}`);

})
