require("./db/mongoose")
const express = require("express")
const session = require("express-session")
const hbs = require("hbs")
const path = require("path")

const app = express()

// Models
const Post = require("./models/post")

// Directories
const partialsDir = path.join(__dirname, "/templates/partials")
const viewsDir = path.join(__dirname, "/templates/views")
const publicDir = path.join(__dirname, "/public")

// Modules
hbs.registerPartials(partialsDir)
app.set("view engine", "hbs")
app.set("views", viewsDir)
app.use(express.static(publicDir))
app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    },
    secret: process.env.COOKIE_SECRET
}))

// Routers
const navRouter = require("./routers/nav")
const postsRouter = require("./routers/posts")
const userRouter = require("./routers/users")
app.use(navRouter)
app.use(postsRouter)
app.use(userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Listening on port " + port + ".")
})