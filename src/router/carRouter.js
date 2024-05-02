const express = require('express');
const router = express.Router();
const carCtrl = require('../controller/carCtrl');


router.post('/', carCtrl.add);
router.get('/', carCtrl.get);
router.get('/:id', carCtrl.getOne);
router.put('/:carId', carCtrl.update);
router.delete('/:carId', carCtrl.delete);

module.exports = router