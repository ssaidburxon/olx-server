const express = require('express');
const router = express.Router();
const carCtrl = require('../controller/carCtrl');


router.post('/', carCtrl.add);
router.get('/', carCtrl.get);
router.get('/:id', carCtrl.getOne);
router.put('/:id', carCtrl.update);
router.delete('/:id', carCtrl.delete);

module.exports = router