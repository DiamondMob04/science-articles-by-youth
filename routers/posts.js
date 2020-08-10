const express = require("express")
const Post = require("../models/post")

const postsRouter = express.Router()

postsRouter.get("/post", async (req, res) => {
    try {
        my_post = new Post(req.query)
        await my_post.save()
        return res.status(200)
    } catch(error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        return res.status(400).send({error: error.errors})
    }
})

module.exports = postsRouter