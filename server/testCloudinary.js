require("dotenv").config();

const cloudinary = require("./config/cloudinary");

cloudinary.api.ping((error, result) => {
  console.log("Error:", error);
  console.log("Result:", result);
});