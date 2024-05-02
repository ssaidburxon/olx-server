const express = require('express');
const router = express.Router();
const fasionCtrl = require('../controller/fashionCtrl');


router.post('/fashion', fasionCtrl.add);
router.get('/fashion', fasionCtrl.get);
router.get('/fashions/:id', fasionCtrl.getOne);
router.put('/fashion/:carId', fasionCtrl.update);
router.delete('/fashion/:carId', fasionCtrl.delete);

module.exports = router