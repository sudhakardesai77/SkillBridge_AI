const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
  console.log("Original Name:", file.originalname);
  console.log("Mime Type:", file.mimetype);

  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed."));
  }

  cb(null, true);
},
});

module.exports = upload;