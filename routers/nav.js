const express = require("express")
const path = require("path")

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

module.exports = navRouter