const express = require("express")
const adminauth = require("../middleware/adminauth")

const adminRouter = express.Router()

adminRouter.get("/approve", adminauth, (req, res) => {
    res.render("approve")
})

module.exports = adminRouter