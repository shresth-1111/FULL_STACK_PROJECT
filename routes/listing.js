const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateListing,isOwner}=require("../middleware.js");

const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})
const lisitngController=require("../controllers/listings.js")

router
    .route("/")
    .get(wrapAsync(lisitngController.index))          //LISTING ROUTE
    .post(
        isLoggedIn,
        upload.single('listing[image]'),  //Line to parse image by multer and save it in cloudinary
        validateListing,
        wrapAsync(lisitngController.createListing)    //CREATE ROUTE
    );

    
//NEW ROUTE
router.get("/new",isLoggedIn,lisitngController.renderNewForm);


router
    .route("/:id/edit")
    .get(isLoggedIn,isOwner,wrapAsync(lisitngController.renderEditForm))                  //EDIT ROUTE
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(lisitngController.updateListing)    //UPDATE ROUTE
);  


router
    .route("/:id")
    .get(wrapAsync(lisitngController.showListing))                             //SHOW ROUTE
    .delete(isLoggedIn,isOwner,wrapAsync(lisitngController.destroyListings)    //DELETE ROUTE
);   


module.exports=router;