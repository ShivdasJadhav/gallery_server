const express = require("express");
const router = express.Router();
const App=require('../controllers/func_app');
router.get("/", App.getAllItems);
router.post('/save',App.add_item);
router.get('/:id',App.getById);
router.post('/:id',App.updateItem);
router.delete('/:id',App.deleteById);
router.get('/status/:email/:type',App.getByStatus);
router.get('/admin_/proposals/:type',App.getAllByStatus);
router.get('/accept/:id',App.acceptById);
router.get('/reject/:id',App.rejectById);
router.post("/update_profile", App.verify,App.update_profile);

module.exports = router;
