const express = require("express");
const router = express.Router();

const userCtrl = require("../controller/userCtrl")

router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUserId);
router.delete('/:id', userCtrl.deleteUser);
router.put('/:id', userCtrl.updateUser);

module.exports = router;