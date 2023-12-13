const express = require("express");
const router = express.Router();
const {
  getAllItems,
  add_item,
  getById,
  getByStatus,
  getAllByStatus,
  updateItem,
  acceptById,
  rejectById,
  deleteById,
} = require("../controllers/func_app");
const { verify } = require("../controllers/common");
router.get("/", getAllItems);
router.post("/save", add_item);
router.get("/:id", getById);
router.post("/:id", updateItem);
router.delete("/:id", deleteById);
router.get("/status/:email/:type", getByStatus);
router.get("/admin_/proposals/:type", getAllByStatus);
router.get("/accept/:id", acceptById);
router.get("/reject/:id", rejectById);

module.exports = router;
