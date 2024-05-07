const express = require('express');
const router = express.Router();
const carCtrl = require('../controller/carCtrl');


router.post('/car', carCtrl.add);
router.get('/car', carCtrl.get);
router.get('/car/:id', carCtrl.getOne);
router.get('/cars/similar', carCtrl.similar)
router.put('/car/:id', carCtrl.update);
router.delete('/car/:id', carCtrl.delete);

module.exports = router