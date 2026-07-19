require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const postRoutes = require("./routes/postRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();


connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/posts", postRoutes);
app.use("/api/analytics", analyticsRoutes);


app.get("/", (req, res) => {
  res.send("🚀 Data Analytics API Running...");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});