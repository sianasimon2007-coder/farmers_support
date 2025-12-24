const express = require("express");
const router = express.Router();

router.post("/recommend", (req, res) => {
  const { soil, season } = req.body;

  const data = {
    loamy: {
      kharif: ["Rice", "Cotton"],
      rabi: ["Wheat", "Mustard"]
    }
  };

  res.json({
    recommendedCrops: data[soil]?.[season] || []
  });
});

module.exports = router;
