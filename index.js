const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const App = require("./routes/app_routes");
const Auth = require("./routes/auth_routes");
const User = require("./routes/user_routes");
const registerMail = require("./controllers/mailer");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
config();

app.use(express.json({ limit: "200kb" }));
// https://artexhibits.netlify.app
app.use(cors({ credentials: true, origin: "https://artexhibits.netlify.app" }));
app.use(cookieParser());
app.use("/auth", Auth);
app.use("/app", App);
app.use("/user", User);
app.use("/mail", registerMail);
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
