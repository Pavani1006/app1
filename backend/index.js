const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Less secure, use only in dev

mongoose.connect("mongodb://localhost:27017/mydb");

app.use("/api/user", userRoutes); // Mount all user routes at /api/user

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
