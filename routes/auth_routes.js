const express = require("express");
const {
  register,
  login,
  verify,
  getUser,
  setUser,
  getUserData,
  localVar,
  deleteUser,
  updatePass,
  // refresh_token,
} = require("../controllers/func_auth");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/updatePass", updatePass);
router.get("/getUser", verify, getUser);
router.get("/getUserData", getUserData);
router.delete("/deleteUser", deleteUser);
// router.get("/refresh", refresh_token, verify, getUser);
module.exports = router;
