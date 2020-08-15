const express = require("express")
const User = require("../models/user")
const multer = require("multer")
const auth = require("../middleware/auth")

const userRouter = express.Router()
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image!"))
        }
        cb(undefined, true)
    }
})

userRouter.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
    try {
        req.session.user.avatar = req.file.buffer
        await req.session.user.save()
        return res.status(200).redirect("/account")
    } catch (error) {
        return res.status(400).redirect("/account")
    }
}, (error, req, res, next) => {
    return res.status(400).redirect("/account")
})

userRouter.delete("/avatar", auth, async (req, res) => {
    req.session.user.avatar = undefined
    await req.session.user.save()
    res.send().redirect("/account")
})

userRouter.get("/avatar/:username", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        if (!user || !user.avatar) {
            return res.render("error")
        }
        res.set("Content-Type", "image/jpg")
        res.send(user.avatar)
    } catch(error) {
        return res.redirect("/error")
    }
})

userRouter.post("/register", async (req, res) => {
    req.body.role = "member"
    let user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.user = user
        req.session.token = token
        res.status(201).send({user, token})
    } catch (error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        res.status(400).send({error: error.errors})
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.username, req.body.password)
        let token = await user.generateAuthToken()
        req.session.user = user
        req.session.token = token
        res.status(200).send({user, token})
    } catch (error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        res.status(400).send({error: error.errors})
    }
})

userRouter.get("/logout", (req, res) => {
    req.session.destroy()
    res.status(200).redirect("home")
})

userRouter.patch("/user", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["username", "description"]
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperator) {
        return res.status(400).send("Invalid updates.")
    }
    try {
        updates.forEach((update) => req.session.user[update] = req.body[update])
        await req.session.user.save()
        res.send(req.session.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

userRouter.get("/info", auth, (req, res) => {
    res.status(200).send({
        username: req.session.user.username, 
        description: req.session.user.description,
        hasAvatar: req.session.user.avatar != undefined
    })
})

module.exports = userRouter