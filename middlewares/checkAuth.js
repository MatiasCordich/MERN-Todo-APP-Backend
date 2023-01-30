const { verify } = require("jsonwebtoken")

const checkAuth = (req, res, next) => {

    const token = req.cookies.access_token

    if (!token) {
        res.status(500)
        res.send({ msg: "NO_TOKEN_AVAILABLE" })
        return
    }

    return verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            res.status(500)
            res.send({ msg: "INVALID_TOKEN" })
        }

        req.user = decoded
        
        return next()

    })
}

module.exports = { checkAuth }