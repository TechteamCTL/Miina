const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// Use the built-in Express body parser
app.use(express.json({ limit: '20mb' })); // Set the size limit here
app.use(express.urlencoded({ extended: true, limit: '20mb' })); // Set the size limit here
app.use(cookieParser());
app.use(fileUpload());

const apiRoutes = require("./routes/apiRoutes");
const connectDB = require("./config/db");
const Product = require("./models/ProductModel");

connectDB();

// Use your routes
app.use("/api", apiRoutes);

// Handle errors
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
