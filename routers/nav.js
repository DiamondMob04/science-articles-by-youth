const express = require("express")
const path = require("path")
const auth = require("../middleware/auth")
const Post = require("../models/post")

const navRouter = express.Router()

navRouter.get("/robots.txt", (req, res) => {
   res.sendFile(path.join(__dirname, "../robots.txt"))
})

navRouter.get("/", (req, res) => {
    res.redirect("/home")
})

navRouter.get("/home", (req, res) => {
    res.render("home")
})

/* req.query.tags is a string of keywords */
/* article tags are also a string of keywords */
navRouter.get("/blog", async (req, res) => {
    res.render("blog")
})

navRouter.get("/register", (req, res) => {
    res.render("register")
})

navRouter.get("/login", (req, res) => {
    res.render("login")
})

navRouter.get("/account", auth, (req, res) => {
    res.render("account")
})

navRouter.get("/members", (req, res) => {
    res.render("members")
})

navRouter.get("/journal", (req, res) => {
    res.render("journal")
})

navRouter.get("/executive-board", (req, res) => {
    res.render("execboard")
})

navRouter.get("/contact", (req, res) => {
    res.render("contact")
})

navRouter.get("/join-say", (req, res) => {
    res.render("joinsay")
})

navRouter.get("/create", auth, (req, res) => {
    res.render("create")
})

module.exports = navRouter