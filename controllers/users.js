const user=require("../models/user");

//Callback to render signup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

//Callback to sing up user 
module.exports.signUp=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new user({email,username});
        const register=await user.register(newUser,password);
        req.logIn(register,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//Callback to render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

//Callback to login 
module.exports.login=async (req,res)=>{
    req.flash("success","Welcome to Wanderlust, You are logged in.");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//Callback to logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    })
}