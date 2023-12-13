const express = require("express");
const router = express.Router();
const {
  getUser,
  deleteUser,
  updatePass,
  updateProfile,
} = require("../controllers/func_user");
router.get("", verify, getUser);
