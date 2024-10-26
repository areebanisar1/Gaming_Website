///////////////////Google//////////////////
const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensures unique email
  password: { type: String, required: true }, // For local authentication
  googleId: { type: String, unique: true }, // For Google OAuth
  role: { type: String, default: "User" }, // Default role set to "User"
});

const MemberModel = mongoose.model("Member", MemberSchema);
module.exports = MemberModel;
