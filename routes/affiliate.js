const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Get invited users by referral code
router.get("/invited/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;
    const invitedUsers = await User.find({ referredBy: referralCode }).select(
      "name email"
    );

    res.json(invitedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
