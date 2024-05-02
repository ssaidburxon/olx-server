const express = require("express");
const router = express.Router();

const authCtrl = require("../controller/authCtrl")

router.post('/signup', authCtrl.signUp);

router.post('/login', authCtrl.signIn);

router.post('/googleAuth', authCtrl.googleAuth);

module.exports = router;