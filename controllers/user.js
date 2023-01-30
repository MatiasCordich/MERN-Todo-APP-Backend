const User = require('../models/User')

const getUserCtrl = async (req, res, next) => {
  
    try {

        const data = await User.findById(req.user.id).select('name email')

        return res.status(200).send({data: data})
    } catch (error) {
        return next(error)
    }
}

const updateUserInfoCtrl = async (req, res, next) => {
  
    try {

        const {name, email} = req.body
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            name,
            email
        },{
            new: true
        }).select('name email')

        return res.status(200).send({data: updatedUser})
    } catch (error) {
        return next(error)
    }
}

const getUserInfoCtrl = async (req, res, next) => {
  
    try {
        const data = await User.findById(req.user.id)
        .select('name email tasks')

        return res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { getUserCtrl, updateUserInfoCtrl, getUserInfoCtrl }