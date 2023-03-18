const express = require("express");
const router = express.Router();
const all_items=require('../controllers/all_items');
router.get("/", all_items.getAllItems);
router.post('/save',all_items.add_item);
router.get('/:id',all_items.getById);
router.post('/:id',all_items.updateItem);
router.delete('/:id',all_items.deleteById);
module.exports = router;
