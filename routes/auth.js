const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const router = express.Router();
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecretKey";

// Sign Up
const generateReferralCode = require("../utils/generateReferral");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, referalId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a new referral code for this user
    const referralCode = generateReferralCode(name);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      referralCode,
      referredBy: referalId || null, // store who referred them
    });

    await newUser.save();

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

   res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    referralCode: user.referralCode, 
    referredBy: user.referredBy,   
  },
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// router.get("/invited/:referralCode", async (req, res) => {
//   try {
//     const { referralCode } = req.params;

//     // Find all users whose referredBy matches this referral code
//     const invitedUsers = await User.find({ referredBy: referralCode })
//       .select("name email");

//     res.json(invitedUsers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

module.exports = router;
