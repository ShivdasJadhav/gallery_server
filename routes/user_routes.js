const express = require("express");
const {common} = require("../controllers/common");
const {func_user} = require("../controllers/func_user");
const router = express.Router();

router.get("/getUser", common.verifyToken, func_user.getUser);
router.post("/updateProfile",common.verifyToken,func_user.updateProfile)
module.exports = router;
