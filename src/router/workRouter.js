const express = require('express')
const router = express.Router()
const workCtrl = require('../controller/workCtrl')


router.post('/work', workCtrl.add)
router.get('/work', workCtrl.get)
router.get('/work/:id', workCtrl.getOne)
router.get('/work/similar', workCtrl.similar)
router.put('/work/:carId', workCtrl.update)
router.delete('/work/:carId', workCtrl.delete)

module.exports = router