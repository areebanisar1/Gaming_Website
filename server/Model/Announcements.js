const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
