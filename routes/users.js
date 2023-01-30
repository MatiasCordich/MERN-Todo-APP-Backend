const express = require('express')
const { getUserInfoCtrl, updateUserInfoCtrl, getUserCtrl } = require('../controllers/user')

const router = express.Router()

router.get('/me/info', getUserInfoCtrl)
router.get('/me', getUserCtrl)
router.put('/me', updateUserInfoCtrl)

module.exports = router