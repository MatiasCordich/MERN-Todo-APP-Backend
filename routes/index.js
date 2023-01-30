const express = require('express')
const taskRoutes = require('./tasks')
const authRoutes = require('./auth')
const userRoutes = require('./users')
const { checkAuth } = require('../middlewares/checkAuth')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/tasks', checkAuth, taskRoutes)
router.use('/users', checkAuth, userRoutes)

module.exports = router