const Listing=require("../models/listing");

//Callback to render all listings
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find();
    res.render("listings/index",{allListings});
};

//Callback to render new listing form
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");  
};

//Cllabck to show a particular lisitng
module.exports.showListing=async (req,res)=>{
    const listing=await Listing.findById(req.params.id)
    .populate("owner")
    .populate({path : "reviews",
        populate: {
            path:"author"
        }
    });
    if(!listing){
        req.flash("error","Listing you asked for does not exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

//Callback to create Listing in DB
module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let listing=req.body.listing;

    let location = listing.location;
    let urlMap = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;
    let response = await fetch(urlMap, {
        headers: {
            "User-Agent": "my-app"
        }
    });

    if (!response.ok) {
        console.log("Error:", await response.text());
        return res.send("Geocoding failed");
    }
    let data = await response.json();
    let lat = parseFloat(data[0].lat);
    let lon = parseFloat(data[0].lon);

    const newListing=new Listing(listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    newListing.geometry={
        type:"Point",
        coordinates:[lon,lat]
    };
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

//Callback for rendering Editing Form
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listEdit=await Listing.findById(id);
    if(!listEdit){
        req.flash("error","Listing you asked for does not exist.");
        return res.redirect("/listings");
    }else{
        res.render("listings/edit.ejs",{listEdit});
    }
};

//Callback for updating the listing 
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});
    if(typeof req.file !== "undefined"){ 
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url, filename};
        await Listing.save();
    }
    req.flash("success","Listing Edited Successfully");
    res.redirect(`/listings/${id}`);
};

//Callback for deleting a listing
module.exports.destroyListings=async (req,res)=>{
    let {id}=req.params;
    let deleteList=await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
};
