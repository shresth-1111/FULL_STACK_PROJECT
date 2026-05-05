const express=require("express");
const router=express.Router({mergeParams: true});

const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews");
const {validateReview,isReviewAuthor,isLoggedIn}=require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//TO HANDLE LOGIN REDIRECT 
router.get("/",reviewController.loginRedirect);

//REVIEWS POST ROUTE TO ADD REVIEW
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//REVIEW DELETE ROUTE TO DELETE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;