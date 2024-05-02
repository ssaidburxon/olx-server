const express = require("express");
const router = express.Router();

const subCtrl = require("../controller/subCtrl")

router.post('/', subCtrl.add)
router.get('/', subCtrl.get)
router.get('/:id', subCtrl.delete)

module.exports = router;