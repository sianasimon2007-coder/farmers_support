const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./routes/chat");
const weatherRoutes = require("./routes/weather");
const cropRoutes = require("./routes/crop");
const imageRoutes = require("./routes/image");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/image", imageRoutes);

app.get("/", (req, res) => {
  res.send("AgriAI Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
