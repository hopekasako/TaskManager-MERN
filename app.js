//app.js

const connect = require("./db/connect");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);


const port = process.env.PORT || 5000;

const server = async () => {
    try {
      await connect();
  
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    } catch (error) {
      console.log("Failed to access server.....", error.message);
      process.exit(1);
    }
  };

  server()