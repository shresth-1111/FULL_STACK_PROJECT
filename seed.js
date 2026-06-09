const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const initData = require("./init/data.js");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dburl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wanderlust";

async function seedDatabase() {
  try {
    await mongoose.connect(dburl);
    console.log("✓ Connected to MongoDB");

    // Clear existing listings
    await Listing.deleteMany({});
    console.log("✓ Cleared existing data");

    // Add owner ID to all listings
    const seedData = initData.data.map((obj) => ({
      ...obj,
      owner: "69c5056e958eaf77c1457d71", // Use your user ID here
    }));

    // Insert data
    await Listing.insertMany(seedData);
    console.log("✓ Database seeded successfully!");
    console.log(`✓ Inserted ${seedData.length} listings`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
