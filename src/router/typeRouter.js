const express = require("express");
const router = express.Router();

const typeCtrl = require("../controller/typeCtrl")

router.post('/', typeCtrl.add)
router.get('/', typeCtrl.get)
router.delete('/:id', typeCtrl.delete)

module.exports = router;