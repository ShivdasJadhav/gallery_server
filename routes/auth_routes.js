const express = require("express");
const {
  register,
  login,
  getUserData,
  localVar,
} = require("../controllers/func_auth");
const { verify } = require("../controllers/common");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/updatePass", updatePass);
router.get("/getUser", verify, getUser);
router.get("/getUserData", getUserData);
router.delete("/deleteUser", deleteUser);
// router.get("/refresh", refresh_token, verify, getUser);
module.exports = router;
