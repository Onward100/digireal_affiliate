const mongoose = require("mongoose");
const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  slot: {
    type: String,
    // required: true,
  },
  slotSize: {
    type: String,
    required: true,
  },
   slotPrice: {
    type: String,
    required: true,
  },
  projectLocation: {
    type: String,
    required: true,
  },

  images: {
    type: [String],
    required: true,
  },
   videos: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
