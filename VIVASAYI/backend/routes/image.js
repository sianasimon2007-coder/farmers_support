const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    crop: "Wheat",
    condition: "Leaf Rust",
    confidence: "88%",
    treatment: "Apply fungicide containing propiconazole"
  });
});

module.exports = router;
