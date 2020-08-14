const express = require("express")
const multer = require("multer")
const Image = require("../models/image")
const auth = require("../middleware/auth")

const imageRouter = express.Router()
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

imageRouter.post("/image", auth, upload.single("image"), async (req, res) => {
    try {
        await Image.deleteMany({owner: req.session.user._id})
        let image = new Image({buffer: req.file.buffer, owner: req.session.user._id})
        await image.save()
        return res.status(200).send({id: image._id})
    } catch (error) {
        return res.status(400)
    }
}, (error, req, res, next) => {
    return res.status(400)
})

imageRouter.get("/image/:id", async (req, res) => {
    try {
        const image = await Image.findById(req.params.id)
        if (!image) {
            return res.render("error")
        }
        res.set("Content-Type", "image/jpg")
        res.send(image.buffer)
    } catch(error) {
        return res.redirect("/error")
    }
})

module.exports = imageRouter