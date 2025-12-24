const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  let reply = "I can help with crops, diseases, weather and prices.";

  if (userMessage.includes("crop")) {
    reply = "Rice, Wheat and Maize are good options for this season.";
  } else if (userMessage.includes("disease")) {
    reply = "Please upload a crop image for disease detection.";
  } else if (userMessage.includes("price")) {
    reply = "Rice price is around ₹2950 per quintal.";
  }

  res.json({ reply });
});

module.exports = router;
