const express = require("express");
const {
  register,
  login,
  // verify,
  getUser,
  setUser,
  getUserData,
  deleteUser,
  sendOtp,
  updatePass
  // refresh_token,
} = require("../controllers/func_auth");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/updatePass", updatePass);
router.post("/sendOtp", sendOtp);
router.post("/getUser", getUser);
router.post("/setUser", setUser);
router.get("/getUserData", getUserData);
router.delete("/deleteUser", deleteUser);
// router.get("/refresh", refresh_token, verify, getUser);
module.exports = router;
