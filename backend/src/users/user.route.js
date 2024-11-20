const express = require("express");
const User = require("./user.model");
const OTP = require("./otp.model");
const bcrypt = require('bcrypt');
require('dotenv').config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const generateToken = require("../middleware/generateToken");
const router = express.Router();

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log("Request received for email:", email);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).send({ message: "User with given email already exists!" });
    }
    // Proceed with registration
    const { error } = User.validateUser({ username, email, password });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    // Generate a 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otpCode);

    // Save OTP in the database
    const otp = new OTP({
      email,
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });
    await otp.save();
    console.log("OTP saved to database for email:", email);
    console.log(otp.expiresAt);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", email);

    res.status(200).send({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error in send-otp:", error);
    res.status(500).send({ message: "Error sending OTP" });
  }
});
// Verify OTP and Register
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;

    // Find the OTP in the database
    const otpEntry = await OTP.findOne({ email, code: otp });
    console.log(otp);
    console.log(otpEntry);
    if (!otpEntry) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }
  
    // Check if OTP has expired
    if (otpEntry.expiresAt < Date.now()) {
      await OTP.deleteOne({ email, code: otp });
      return res.status(400).send({ message: "OTP has expired" });
    }

    // Delete the OTP entry after successful verification
    await OTP.deleteOne({ email, code: otp });

    // Proceed with registration
    const { error } = User.validateUser({ username, email, password });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error verifying OTP or registering user:", error);
    res.status(500).send({ message: "Error verifying OTP or registering user" });
  }
});
// login user endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.status === "block") {
      return res.status(406).send({ message: "User Blocked. Contact Cust. Care" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password not match" });
    }
    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).send({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        place: user.place,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error logged in user", error);
    res.status(500).send({ message: "Error logged in user" });
  }
});

// logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
});


// delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send({ message: "Error deleting user" });
  }
});

// get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role status").sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ message: "Error fetching user" });
  }
});

// update user 
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(id, { role, status }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).send({ message: "Error updating user " });
  }
});

// edit or update profile
router.patch("/edit-profile", async (req, res) => {
  try {
    const { userId, username, profileImage, place, phone } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    // update profile
    if (username !== undefined) user.username = username;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (place !== undefined) user.place = place;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.status(200).send({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        place: user.place,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error updating user profile", error);
    res.status(500).send({ message: "Error updating user profile" });
  }
});

// Send OTP password reset
router.post("/sendpass-otp", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request received for email:", email);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log("User not exists:", email);
      return res.status(409).send({ message: "User with given email not exists!" });
    }
    // Proceed with registration
    const { error } = User.validateUser({email, password });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    // Generate a 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otpCode);

    // Save OTP in the database
    const otp = new OTP({
      email,
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });
    await otp.save();
    console.log("OTP saved to database for email:", email);
    console.log(otp.expiresAt);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", email);

    res.status(200).send({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error in send-otp:", error);
    res.status(500).send({ message: "Error sending OTP" });
  }
});

// forgot password
router.post("/forgotpass", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Find the OTP in the database
    const otpEntry = await OTP.findOne({ email, code: otp });
    console.log(otp);
    console.log(otpEntry);
    if (!otpEntry) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }
  
    // Check if OTP has expired
    if (otpEntry.expiresAt < Date.now()) {
      await OTP.deleteOne({ email, code: otp });
      return res.status(400).send({ message: "OTP has expired" });
    }

    // Delete the OTP entry after successful verification
    await OTP.deleteOne({ email, code: otp });

    // Proceed with registration
    const { error } = User.validateUser({ email, password });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({email}, {password:hashedPassword});

    res.status(201).send({ message: "Password Change successfully!" });
  } catch (error) {
    console.error("Error verifying OTP :", error);
    res.status(500).send({ message: "Error verifying OTP " });
  }
});

module.exports = router;
