const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config(); // For environment variables
const multer = require("multer");
const archiver = require("archiver");
const path = require("path");
const MemberModel = require("./Model/Members");
const Event = require("./Model/Events");
const EventRequest = require("./Model/EventRequest");
const GalleryModel = require("./Model/Gallery");
const ApplicationModel = require("./Model/Apply");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 5000;
const otpStore = {};
let Saveemail, Saverole, Savename;
const TaskModel = require("./Model/Task");

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/GamingSociety", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Setup for file uploads and downloads
const uploadDir = path.join(__dirname, "uploads");
app.get("/download-all", (req, res) => {
  const zip = archiver("zip", { zlib: { level: 9 } });
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="images.zip"');
  zip.pipe(res);
  zip.directory(uploadDir, false);
  zip.finalize();
});

app.post("/delete-image", (req, res) => {
  const { _id } = req.body;
  GalleryModel.deleteOne({ _id }).then(() => {
    res.json({ message: "Image deleted successfully" });
  });
});

app.post("/tasks", (req, res) => {
  TaskModel.create(req.body).then(() => {
    res.json("Task Added successfully");
  });
});

app.get("/tasks", (req, res) => {
  TaskModel.find({ assignedTo: Saveemail }).then((result) => {
    res.json(result);
  });
});

app.post("/tasks-completed", (req, res) => {
  const { _id } = req.body;
  TaskModel.updateOne({ _id: _id }, { $set: { completed: true } }).then(() => {
    res.json("Task completed");
  });
});

app.get("/members", (req, res) => {
  MemberModel.find({ role: "Member", role: "Vice Head" })
    .then((members) => res.json(members))
    .catch((err) => res.json(err));
});

app.post("/logout", (req, res) => {
  Saveemail = "";
  Saverole = "";
  res.json("yes");
});
// const handleLogoutConfirm = async () => {
//   try {
//     await axios.post("http://localhost:3001/logout");
//     setRole("");
//     setEmail("");
//     navigate("/dashboard");
//   } catch (error) {
//     console.error("Logout failed:", error);
//   }

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newImage = new GalleryModel({
      image: req.file.path,
      name: req.file.originalname,
    });
    await newImage.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.redirect("/home");
  }
);

app.get("/api-gallery", async (req, res) => {
  const events = await GalleryModel.find();
  res.json(events);
});

// Event Requests
app.post("/request-event", async (req, res) => {
  try {
    const newRequest = new EventRequest(req.body);
    await newRequest.save();
    res.status(201).send(newRequest);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/get-role", (req, res) => {
  if (Saveemail) {
    return res.json({ email: Saveemail, role: Saverole, name: Savename });
  } else {
    res.json("Invalid");
  }
});

app.get("/request-event", async (req, res) => {
  try {
    const requests = await EventRequest.find({ status: "Pending" });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/approve-event", async (req, res) => {
  try {
    const { _id } = req.body;
    const request = await EventRequest.findById(_id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const event = new Event({
      eventName: request.eventName,
      eventDate: request.eventDate,
      eventDescription: request.eventDescription,
      eventLocation: "TBD",
      eventTime: "TBD",
    });

    await event.save();
    await EventRequest.updateOne(
      { _id: _id },
      { $set: { status: "Approved" } }
    );
    res.json({ message: "Request approved and event created" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/decline-event", async (req, res) => {
  try {
    const { _id } = req.body;
    const request = await EventRequest.findById(_id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await EventRequest.updateOne(
      { _id: _id },
      { $set: { status: "Rejected" } }
    );
    res.status(200).json({ message: "Request declined" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign Up Route
app.post("/signup", async (req, res) => {
  const { fullname, email, phone, password } = req.body;
  try {
    const member = await MemberModel.findOne({ email });
    if (member) {
      res.json({ message: "Already exists" });
    } else {
      // Store plain password for debugging
      const newUser = new MemberModel({
        fullname,
        email,
        phone,
        password, // Store plain password here
      });
      await newUser.save();
      res.status(201).json({ message: "Successfully registered" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const member = await MemberModel.findOne({ email });
    if (member) {
      // Compare plain password
      if (password === member.password) {
        Saveemail = member.email;
        Saverole = member.role;
        Savename = member.name;
        res.json({ message: "Successfully Login" });
      } else {
        res.json({ message: "The password is incorrect" });
      }
    } else {
      res.json({ message: "No email existed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Password Reset
function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post("/forget-password", (req, res) => {
  const { email } = req.body;
  MemberModel.findOne({ email }).then((member) => {
    if (!member) {
      res.status(404).json({ message: "Incorrect email" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const code = generateSixDigitCode();
    otpStore[email] = code;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Your OTP is: ${code}`,
      html: `<b>Your OTP is: ${code}</b>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email" });
      } else {
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  });
});

app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (otpStore[email] && otpStore[email] == code) {
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Incorrect OTP" });
  }
});

app.post("/reset-password", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    MemberModel.updateOne({ email }, { $set: { password: hashedPassword } })
      .then(() => {
        res.json({ message: "Password successfully changed" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Internal server error" });
      });
  });
});

// Announcement model definition
const announcementSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

// API routes for announcements
app.post("/announcements", async (req, res) => {
  try {
    const newAnnouncement = new Announcement(req.body);
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/announcements/:id", async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/announcements/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
///////////////////////////
// Applications
app.get("/applications", (req, res) => {
  ApplicationModel.find({ status: "Pending" }).then((applications) =>
    res.json(applications)
  );
});

app.post("/apply", async (req, res) => {
  const newApplication = new ApplicationModel(req.body);
  await newApplication.save();
  res.json({ message: "Application submitted successfully" });
});
app.post("/applications-rejects", (req, res) => {
  const { _id } = req.body;

  ApplicationModel.updateOne(
    { _id: _id },
    { $set: { status: "Rejected" } }
  ).then(() => {
    res.json("Application reject Successfully");
  });
});
app.post("/applications-approve", (req, res) => {
  const { _id } = req.body;
  console.log(_id);
  ApplicationModel.findById({ _id: _id }).then((application) => {
    console.log(application);
    if (application) {
      console.log(application);

      MemberModel.updateOne(
        { email: application.email },
        { $set: { role: application.role } }
      ).then(() => {
        ApplicationModel.updateOne(
          { _id: _id },
          { $set: { status: "Approved" } }
        ).then(() => {
          res.json("Application approved Successfully");
        });
      });
    } else {
      res.json("Application not found");
    }
  });
});

app.delete("/applications/:id", (req, res) => {
  const { id } = req.params;
  ApplicationModel.findByIdAndDelete(id).then(() =>
    res.json({ message: "Application deleted" })
  );
});

/////////////////
// Events

app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).send(newEvent);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// server/routes/teams.js
const router = express.Router();

module.exports = router;

/////////////////////////////////History
app.get("/applications-history", async (req, res) => {
  try {
    const history = await ApplicationModel.find({
      status: { $ne: "Pending" },
    }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).send("Error fetching history");
  }
});

app.get("/events-history", async (req, res) => {
  try {
    const history = await EventRequest.find({
      status: { $ne: "Pending" },
    }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).send("Error fetching history");
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    const teams = await MemberModel.find(); // Fetch all members
    console.log(teams); // Log the data to ensure it is being fetched
    res.json(teams); // This should return an array of members
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
