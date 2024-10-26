const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  qualification: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const ApplicationModel = mongoose.model("Application", ApplicationSchema);

module.exports = ApplicationModel;
