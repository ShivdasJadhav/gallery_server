const express = require("express");
const router = express.Router();
const {func_app} = require("../controllers/func_app");
const {common} = require("../controllers/common");
router.get("/", common.verifyToken,func_app.getAllArts);
router.get("/getCount", common.verifyToken,func_app.getCount);
router.post("/newArt", common.verifyToken,func_app.addArt);
// router.get("/:id", common.verifyToken,func_app.getById);
router.post("/updateArt", common.verifyToken,func_app.updateArt);
router.delete("/deleteArt/:id", common.verifyToken,func_app.deleteById);
router.get("/getByStatus/:type", common.verifyToken,func_app.getByStatus);
// router.get("/admin_/proposals/:type", common.verifyToken,func_app.getAllByStatus);
// router.get("/accept/:id", common.verifyToken,func_app.acceptById);
// router.get("/reject/:id", common.verifyToken,func_app.rejectById);

module.exports = router;
