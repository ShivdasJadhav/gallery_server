const express = require("express");
const {
  saveInfo,
  login,
  // verify,
  getUser,
  setUser,
  getUserData,
  deleteUser,
  // refresh_token,
} = require("../controllers/route_functions");
const router = express.Router();
router.post("/signup", saveInfo);
router.post("/login", login);
router.post("/getUser", getUser);
router.post("/setUser", setUser);
router.get("/getUserData", getUserData);
router.delete("/deleteUser", deleteUser);
// router.get("/refresh", refresh_token, verify, getUser);
module.exports = router;
