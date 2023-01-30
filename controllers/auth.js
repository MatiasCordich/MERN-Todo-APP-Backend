const User = require('../models/User')
const { genSalt, hash, compare } = require("bcryptjs")
const { sign, verify } = require('jsonwebtoken')

const registerCtrl = async (req, res) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(401)
        res.send('ERROR: El campo es requerido')
    }

    try {

        const isExist = await User.findOne({ email })

        if (isExist) {
            res.status(500)
            res.send({ msg: "USER_ALREADY_EXISTS", status: false })
            return
        }

        const salt = await genSalt(10)

        const hashedPassword = await hash(password, salt)

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        })

        await newUser.save()

        return res.status(200).send({ status:true, msg: "User Created", data: newUser })

    } catch (error) {
        res.status(500)
        res.status({ msg: "ERROR_REGISTER_USER" })
    }
}

const loginCtrl = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        res.status(401)
        res.send('ERROR: El campo es requerido')
    }

    try {

        const isExist = await User.findOne({ email })

        if (!isExist) {
            res.status(401)
            res.send({ msg: "Email inexistente", status: false })
            return
        }

        const passwordHashed = isExist.password

        const isPasswordCorrect = await compare(password, passwordHashed)

        if (!isPasswordCorrect) {
            res.status(500)
            res.send({ msg: "Password incorrecta", status: false })
            return
        }

        const payload = {
            id: isExist._id,
            name: isExist.name
        }

        const token = sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        return res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).send({ msg: "LOGIN_SUCCESS", status: true })


    } catch (error) {
        res.status(500)
        res.send({ msg: "ERROR_LOGIN_USER" })
    }

}

const logOutCtrl = async (req, res) => {
    res.clearCookie('access_token')
    return res.status(200).send({ msg: "LOG_OUT_SUCCESS" })
}

const isLoggedIn = async (req, res) => {

    const token = req.cookies.access_token

    if (!token) {
        return res.send(false)
    }

    return verify(token, process.env.JWT_SECRET, (err) => {
        
        if (err) {
            return res.send(false)
        }
        
        return res.send(true)

    })
}

module.exports = { registerCtrl, loginCtrl, logOutCtrl, isLoggedIn }