const express = require("express");
const {func_auth} = require("../controllers/func_auth");
const {common} = require("../controllers/common");

const router = express.Router();
router.post("/register", func_auth.register);
router.post("/login", func_auth.login);
router.get("/forgot/*", func_auth.getDetails);
router.get("/getUserCount", func_auth.getUserCount);
router.post("/updatePassword", func_auth.updatePassword);

module.exports = router;
