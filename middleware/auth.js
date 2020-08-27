const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    try {
        const token = req.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, "token": token})
        req.session.user = user
        if (!user) {
            throw new Error()
        }
        next()
    } catch (error) {
        res.status(401).redirect("/login")
    }
} 

module.exports = auth