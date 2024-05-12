const express = require('express');
const router = express.Router();
const fashionCtrl = require('../controller/fashionCtrl');


router.post('/fashion', fashionCtrl.add);
router.get('/fashion', fashionCtrl.get);
router.get('/fashions/:id', fashionCtrl.getOne);
router.get('/fashion/similar', fashionCtrl.similar)
router.put('/fashion/:carId', fashionCtrl.update);
router.delete('/fashion/:fashionId', fashionCtrl.delete);

module.exports = router