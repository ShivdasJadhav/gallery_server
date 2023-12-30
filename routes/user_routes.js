const express = require("express");
const { common } = require("../controllers/common");
const { func_user } = require("../controllers/func_user");
const router = express.Router();

router.get("/getUser", common.verifyToken, func_user.getUser);
router.post("/userInfo",common.verifyToken, func_user.userData);
router.get("/getUserById/:id", common.verifyToken, func_user.getUserById);
router.post("/updateProfile", common.verifyToken, func_user.updateProfile);
router.get("/getUsers", common.verifyToken, func_user.getUsers);
router.get("/getPostBy/:id", common.verifyToken, func_user.getPostBy);
router.post("/deleteUser", common.verifyToken, func_user.deleteUser);
module.exports = router;
