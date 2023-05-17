const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const routes = require("./routes/Item_route");
const router = require("./routes/routes");
const cookie = require("cookie-parser");
const { config } = require("dotenv");
config();
app.use(express.json());
// app.use());
app.use(cors({ credentials: true, origin: "http://localhost:3000/" }));
app.use("/auth", router);
app.use("/items", routes);
mongoose
  .connect(
    `mongodb+srv://admin:${process.env.DB_PASS}@gallary0.bs3rtjt.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connected with cluster:\t Gallary0");
  })
  .then(() => {
    app.listen(5000, (req, res, next) => {
      console.log("listing on port 5000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect with Cluster:\n", err);
  });
