const express = require("express");
const router = express.Router();
const {func_app} = require("../controllers/func_app");
const {common} = require("../controllers/common");
router.get("/", );
router.post("/save", func_app.add_item);
router.get("/:id", func_app.getById);
router.post("/:id", func_app.updateItem);
router.delete("/:id", func_app.deleteById);
router.get("/status/:email/:type", func_app.getByStatus);
router.get("/admin_/proposals/:type", func_app.getAllByStatus);
router.get("/accept/:id", func_app.acceptById);
router.get("/reject/:id", func_app.rejectById);

module.exports = router;
