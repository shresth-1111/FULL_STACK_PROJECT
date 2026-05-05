const express=require("express");
const user = require("../models/user");
const router=express.Router();
const passport=require("passport");

const {saveRedirectUrl}=require("../middleware");

const userController = require("../controllers/users");

//Sign Up Routes

//Route to render signup form
router.get("/signup",userController.renderSignupForm);

//Route to receive post request containing user detilas and store it in db 
router.post("/signup",userController.signUp);

//Login Routes

//Route to render login form 
router.get("/login",userController.renderLoginForm);

//Route to check authentication
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

//Route to log out 
router.get("/logout",userController.logout);

module.exports=router;