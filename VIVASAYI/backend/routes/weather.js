const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    location: "Punjab, India",
    temperature: 32,
    humidity: 60,
    condition: "Partly Cloudy"
  });
});

module.exports = router;
