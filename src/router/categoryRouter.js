const express = require("express");
const router = express.Router();

const categoryCtrl = require("../controller/categoryCtrl")

router.post('/', categoryCtrl.add)
router.get('/', categoryCtrl.get)
router.get('/:id', categoryCtrl.getOne)

module.exports = router;