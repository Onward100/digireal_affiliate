// routes/admin.js
const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Get all affiliates + their invited users
router.get("/affiliates", async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find().select("name email referralCode referredBy");

    // Build a map of referralCode -> users invited
    const affiliateMap = {};
    users.forEach((user) => {
      if (user.referredBy) {
        if (!affiliateMap[user.referredBy]) affiliateMap[user.referredBy] = [];
        affiliateMap[user.referredBy].push({ name: user.name, email: user.email });
      }
    });

    // Now build final response
    const affiliates = users.map((u) => ({
      name: u.name,
      email: u.email,
      referralCode: u.referralCode,
      invitedUsers: affiliateMap[u.referralCode] || [],
    }));

    res.json(affiliates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
