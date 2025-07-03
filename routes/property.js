const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Property = require("../models/property.js");

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to upload buffer to Cloudinary with correct resource type
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("video") ? "video" : "image";

    const stream = cloudinary.uploader.upload_stream(
      { folder: "properties", resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 🆕 Create a new property with images and videos
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { title, description, price, slot, slotSize, project, location } =
      req.body;

    // Validate required fields
    if (!title || !description || !price || !location) {
      return res.status(400).json({
        message: "Title, description, price, and location are required",
      });
    }

    const uploadedImages = [];
    const uploadedVideos = [];

    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, file.mimetype);
          if (file.mimetype.startsWith("video")) {
            uploadedVideos.push(url);
          } else {
            uploadedImages.push(url);
          }
        })
      );
    }

    const property = new Property({
      title,
      description,
      price,
      slot,
      slotSize,
      project,
      location,
      images: uploadedImages,
      videos: uploadedVideos,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🆕 Update a property by ID
router.put("/:id", upload.array("files"), async (req, res) => {
  try {
    const updates = req.body;

    const uploadedImages = [];
    const uploadedVideos = [];

    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, file.mimetype);
          if (file.mimetype.startsWith("video")) {
            uploadedVideos.push(url);
          } else {
            uploadedImages.push(url);
          }
        })
      );
    }

    if (uploadedImages.length > 0) updates.images = uploadedImages;
    if (uploadedVideos.length > 0) updates.videos = uploadedVideos;

    const property = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(400).json({ message: error.message });
  }
});

// 🆕 Get all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🆕 Get a property by ID
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🆕 Delete a property by ID
router.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
