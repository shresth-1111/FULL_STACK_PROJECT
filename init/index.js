const mongoose=require("mongoose");

const Listing=require("../models/listing.js")
const initData=require("./data");

main()
.then((res)=>{
    console.log("CONNECTINO SUCCESSFUL!!!");
}).catch((err)=>{
    console.log("ISSUE IN CONNECTION")
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
};

let insertdata=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"69c5056e958eaf77c1457d71",
    }))
    await Listing.insertMany(initData.data);
    console.log("INSERTION SUCCESS");
}

insertdata();