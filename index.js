require("./db/mongoose")
const express = require("express")
const session = require("express-session")
const hbs = require("hbs")
const path = require("path")
const cors = require("cors")

const app = express()

// Directories
const partialsDir = path.join(__dirname, "/templates/partials")
const viewsDir = path.join(__dirname, "/templates/views")
const publicDir = path.join(__dirname, "/public")

// Modules & Middleware
const stripXSS = require("./middleware/xss")
const MongoStore = require("connect-mongo")(session)
hbs.registerPartials(partialsDir)
app.set("view engine", "hbs")
app.set("views", viewsDir)
app.use(cors())
app.use(express.static(publicDir))
app.use(express.json())
app.use(stripXSS)
var sess = { 
    store: new MongoStore({db: "session", url: process.env.MONGODB_URL}), 
    secret: process.env.COOKIE_SECRET, 
    resave: true, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true, 
        secure: false,
        sameSite: "lax"
    } 
}
// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1) 
//     sess.cookie.secure = true 
//     console.log("Running on production mode! Cookies are set to secure.")
//   }
app.use(session(sess))

// Routers
const navRouter = require("./routers/nav")
const postsRouter = require("./routers/posts")
const accountsRouter = require("./routers/accounts")
const userPagesRouter = require("./routers/userpages")
const imageRouter = require("./routers/images")
app.use(navRouter)
app.use(imageRouter)
app.use(postsRouter)
app.use(accountsRouter)
app.use(userPagesRouter)

app.get("*", (req, res) => {
    res.render("error")
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Listening on port " + port + ".")
})