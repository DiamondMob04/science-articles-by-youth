const User = require("../models/user")
const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        const token = req.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, "tokens.token": token})
        if (!user) {
            throw new Error()
        }
        req.session.token = token
        req.session.user = user
        next()
    } catch (error) {
        res.status(401).send("User is not authenticated.")
    }
} 

module.exports = auth