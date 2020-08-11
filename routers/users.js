const express = require("express")
const User = require("../models/user")
const auth = require("../middleware/auth")

const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    try {
        let user = new User(req.body)
        await user.save()
        let token = await user.generateAuthToken()
        req.session.token = token
        res.status(200).send({user, token})
    } catch (error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        res.status(400).send({error: error.errors})
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.username, req.body.password)
        if (!user) {
            throw new Error("Username or password is incorrect.")
        }
        let token = await user.generateAuthToken()
        req.session.token = token
        res.status(200).send({user, token})
    } catch (error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        res.status(400).send({error: error.errors})
    }
})

userRouter.get("/get-username", auth, (req, res) => {
    res.status(200).send({username: req.session.user.username})
})

module.exports = userRouter