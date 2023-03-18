const express = require("express");
const mongoose = require("mongoose");
const cors =require('cors');
const app = express();
const routes=require('./routes/Item_route');
app.use(express.json());
app.use(cors());
app.use('/items',routes);
mongoose
  .connect(
    "mongodb+srv://admin:MyGallary%40Admin@gallary0.bs3rtjt.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected with cluster:\t Gallary0");
  })
  .then(() => {
    app.listen("https://gallary-server.vercel.app/", (req, res, next) => {
      console.log("listing on port 5000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect with Cluster:\n", err);
  });
