const express = require("express")
const path = require("path")
const auth = require("../middleware/auth")

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

navRouter.get("/blog", (req, res) => {
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

module.exports = navRouter