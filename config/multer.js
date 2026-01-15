const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Portfolio",   // folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 400, height: 400, crop: "fill" }
    ]
  },
});

const upload = multer({ storage });

module.exports = upload;
