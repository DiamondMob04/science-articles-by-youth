const express = require("express")
const User = require("../models/user")

const userPagesRouter = express.Router()

userPagesRouter.get("/user/:username", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        if (!user) return res.sendStatus(400)
        res.status(200).render("publicuser", {
            username: user.username,
            description: user.description,
            id: user._id
        })
    } catch (error) {
        return res.status(400).redirect("/error")
    }
})

userPagesRouter.get("/users", async (req, res) => {
    if (!req.query.skip) req.query.skip = 0
    if (!req.query.limit) req.query.limit = 10
    if (req.query.skip < 0 || req.query.limit <= 0 || req.query.limit > 100) {
        return res.status(400).send({error: "Invalid limit/skip query. (0 <= req.query.skip) (0 < req.query.limit <= 100)"})
    }
    // Adding one extra user to the limit to check if there are more after.
    var userData = undefined
    if (req.query.admin != "true") {
        userData = await User.find({}).sort({"createdAt": -1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit) + 1)
    } else {
        userData = await User.find({role: "admin"}).sort({"createdAt": -1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit) + 1)
    }
    let moreUsers = userData.length > req.query.limit
    if (moreUsers) userData.pop()
    let users = []
    for (let i = 0; i < userData.length; i++) {
        let currUser = userData[i].toObject()
        users.push({
            username: currUser.username,
            role: currUser.role,
            description: currUser.description,
            hasAvatar: currUser.avatar != undefined
        })
    }
    res.send({ users, skipQuery: req.query.skip, limitQuery: req.query.limit, moreUsers })
})

module.exports = userPagesRouter