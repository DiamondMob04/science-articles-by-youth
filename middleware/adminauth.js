const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const adminauth = async (req, res, next) => {
    try {
        const token = req.session.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded, "token": token})
        if (!user) {
            throw new Error()
        }
        if (user.role !== "admin") {
            return res.status(400).redirect("/account")
        }
        next()
    } catch (error) {
        res.status(401).redirect("/login")
    }
}

module.exports = adminauth