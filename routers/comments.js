const express = require("express")
const auth = require("../middleware/auth")
const Post = require("../models/post")

const commentsRouter = express.Router()

commentsRouter.post("/comment/:id", auth, async (req, res) => {
    if (req.body.message.length === 0) {
        return res.status(400).send({error: "Message length has to be greater than 0 characters."})
    }
    const post = await Post.findOne({identifier: req.params.id})
    if (!post) {
        return res.status(404).send({error: "Could not find specified post. This is likely a server-side fault."})
    }
    const comment = {
        author: req.session.user.username,
        contents: req.body.message
    }
    post.comments.push(comment)
    try {
        await post.save()
        res.sendStatus(200)
    } catch(error) {
        res.status(400).send({error: "We were not able to save your comment. Please reload and try again."})
    }
})

commentsRouter.get("/comments/:id", async (req, res) => {
    if (!req.query.skip) req.query.skip = 0
    if (!req.query.limit) req.query.limit = 10
    if (req.query.skip < 0 || req.query.limit <= 0 || req.query.limit > 100) {
        return res.status(400).send({error: "Invalid limit/skip query. (0 <= req.query.skip) (0 < req.query.limit <= 100)"})
    }
    // Adding one extra comment to the limit to check if there are more after.
    const post = await Post.findOne({identifier: req.params.id})
    var commentData = post.comments.reverse().slice(parseInt(req.query.skip), parseInt(req.query.skip) + parseInt(req.query.limit) + 1)
    let moreComments = commentData.length > req.query.limit
    if (moreComments) commentData.pop()
    let comments = []
    for (let i = 0; i < commentData.length; i++) {
        let currComment = commentData[i].toObject()
        if (currComment.author && currComment.contents) {
            comments.push({
                author: currComment.author,
                contents: currComment.contents
            })
        }
    }
    res.send({ comments, skipQuery: req.query.skip, limitQuery: req.query.limit, moreComments })
})

module.exports = commentsRouter