const express = require("express");
const {
  saveInfo,
  login,
  // verify,
  getUser,
  setUser,
  // refresh_token,
} = require("../controllers/route_functions");
const router = express.Router();
router.post("/signup", saveInfo);
router.post("/login", login);
router.get("/getUser/:email", getUser);
router.post("/setUser", setUser);
// router.get("/refresh", refresh_token, verify, getUser);
module.exports = router;
