const express = require("express")
const User = require("../models/user")

const userPagesRouter = express.Router()

userPagesRouter.get("/user/:username", (req, res) => {
    res.send(req.params.username)
})

userPagesRouter.get("/users", async (req, res) => {
    if (!req.query.skip) req.query.skip = 0
    if (!req.query.limit) req.query.limit = 10
    if (req.query.skip < 0 || req.query.limit <= 0 || req.query.limit > 100) {
        return res.status(400).send({error: "Invalid limit/skip query. (0 <= req.query.skip) (0 < req.query.limit <= 100)"})
    }
    // Adding one extra user to the limit to check if there are more after.
    const userData = await User.find({}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit) + 1)
    let moreUsers = userData.length > req.query.limit
    if (moreUsers) userData.pop()
    let users = []
    for (let i = 0; i < userData.length; i++) {
        let currUser = userData[i].toObject()
        users.push({
            username: currUser.username,
            role: currUser.role,
            description: currUser.description
        })
    }
    res.send({ users, skipQuery: req.query.skip, limitQuery: req.query.limit, moreUsers })
})

module.exports = userPagesRouter