if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRoutes=require("./routes/listing.js")
const reviewRoutes=require("./routes/review.js")
const userRoutes=require("./routes/user.js");

const port=8080;

const { error } = require("console");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

// Use MongoDB Atlas in production, local MongoDB in development
const dburl = process.env.ATLASDB_URL ;

main()
.then((res)=>{
    console.log("CONNECTION SUCCESSFUL");
}).catch((err)=>{
    console.log("ISSUE IN DATABASE SETUP");
    console.log(err);
});


async function main(){
    await mongoose.connect(dburl);
};

//For deployment purpose to store things properly
const store = new MongoStore({
    mongoUrl:dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
})

store.on("error",()=>{
    console.log("ERROR in MONFO SESSION STORE",err);
})

//SESSION DETAILING
const sessionOptions={
    store,  //PEHLE SESSION MEMORY HAMARE LOCAL MEMORY PE HI STORE HOTI THI NOW THIS "STORE" WILL MAKE IT ON MONGO
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,  //7 days me 24 hours har hour me 60 min har min me 60 sec har sec me 1000 ms 
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.use(session(sessionOptions));
app.use(flash());

//Configuration for Passports 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for flash set up with every route in case it needed
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//MIDDLEWARE FOR EXPRESS ROUTER TO READ REVIEWS ROUTE
app.use("/listings/:id/reviews",reviewRoutes);

///MIDDLEWARE FOR EXPRESS ROUTER TO READ LISTINGS ROUTE 
app.use("/listings",listingRoutes);

//MIDDLEWARE FOR EXPRESS ROUTER TO READ USER ROUTE
app.use("/",userRoutes);

//ADMIN SEEDING ROUTE - Check count and seed if needed
app.get("/admin/seed", async (req, res) => {
  try {
    const Listing = require("./models/listing.js");
    const initData = require("./init/data.js");

    // Check current listing count
    const count = await Listing.countDocuments({});
    
    if (count > 20) {
      // Already seeded, don't seed again
      return res.send(`
        <html>
          <head><title>Seed Status</title></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="color: green;">✓ Database Already Seeded</h1>
            <p>Current listings in database: <strong>${count}</strong></p>
            <p>Seeding is not required (>20 listings found)</p>
            <a href="/">← Back to Home</a>
          </body>
        </html>
      `);
    }

    // Seed the database with all listings
    const seedData = initData.data;
    
    await Listing.insertMany(seedData);

    res.send(`
      <html>
        <head><title>Seed Success</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1 style="color: green;">✓ Database Seeded Successfully!</h1>
          <p>Inserted <strong>${seedData.length}</strong> listings</p>
          <p>All listings belong to Owner 1: 69f80a93338df57e2a31b284</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).send(`
      <html>
        <head><title>Seed Error</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1 style="color: red;">❌ Seeding Failed</h1>
          <p>${err.message}</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
  }
});

//ROOT ROUTE
//Commenting this out so that no one can go to root route it should show page not found option.
// app.get("/",(req,res)=>{
//     res.send("Hi I am root!!");
// });

//User Login Creation FAKE USER
// app.get("/registerUser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"monika.sinha@gmail.com",
//         username:"shreyash@2010"
//     })
//     let newUser=await User.register(fakeUser,"AAQWERTYUIOP123321");
//     res.send(newUser);
// })

//FOR HANDLING ALL UNDEFINED ROUTES
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next)=>{
    console.log(err);
    let {statusCode=500,statusMessage="Something Went Wrong"}=err;
    res.status(statusCode).render("listings/error.ejs", { statusMessage });
});

//LISTENING ROUTE
app.listen(port,()=>{
    console.log("Server is listening to port 8080");
});