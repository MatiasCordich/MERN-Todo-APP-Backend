const express = require('express')
const { registerCtrl, loginCtrl, logOutCtrl, isLoggedIn } = require('../controllers/auth')

const router = express.Router()

router.post('/register', registerCtrl )
router.post('/login', loginCtrl)
router.get('/logout', logOutCtrl)
router.get('/is_logged_in', isLoggedIn)

module.exports = router