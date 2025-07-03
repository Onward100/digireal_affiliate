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
  price: {
    type: Number,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  slotSize: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
