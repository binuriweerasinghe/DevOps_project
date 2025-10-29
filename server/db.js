// db.js
const mongoose = require('mongoose');
require('dotenv').config();  // load .env

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error("❌ MONGODB_URI is not defined in the environment variables");
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = mongoose;




