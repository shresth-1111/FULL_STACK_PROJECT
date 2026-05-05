const Review=require("../models/reviews")
const Listing=require("../models/listing")

//Callback to handle get request by login on /listings/id/reviews
module.exports.loginRedirect=(req,res)=>{
    res.redirect(`/listings/${req.params.id}`);
}

//CallBack to create a review
module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added Successfully");
    res.redirect(`/listings/${listing._id}`)
}

//Callback to delete a review 
module.exports.destroyReview=async (req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);  
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}