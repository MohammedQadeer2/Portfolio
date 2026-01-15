const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}, { timestamps: true });

const ProfileSchema = new mongoose.Schema({
    profileImage: String,
}, { timestamps: true });

module.exports = mongoose.model("Contact", ContactSchema);
module.exports = {
  Contact: mongoose.model("Contact", ContactSchema),
  Profile: mongoose.model("Profile", ProfileSchema)
};