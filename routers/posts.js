const express = require("express")
const auth = require("../middleware/auth")
const Post = require("../models/post")
const User = require("../models/user")

const postsRouter = express.Router()

postsRouter.get("/article/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            throw new Error()
        }
        const user = await User.findById(post.author)
        res.render("publicarticle", {
            title: post.title,
            author: user.username,
            contents: post.contents
        })
    } catch (error) {
        return res.redirect("/error")
    }
})

postsRouter.post("/post", auth, async (req, res) => {
    try {
        req.body.author = req.session.user._id
        my_post = new Post(req.body)
        await my_post.save()
        return res.send()
    } catch(error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        return res.status(400).send({error: error.errors})
    }
})

postsRouter.get("/posts", async (req, res) => {
    if (!req.query.skip) req.query.skip = 0
    if (!req.query.limit) req.query.limit = 10
    if (req.query.skip < 0 || req.query.limit <= 0 || req.query.limit > 100) {
        return res.status(400).send({error: "Invalid limit/skip query. (0 <= req.query.skip) (0 < req.query.limit <= 100)"})
    }
    // Adding one extra post to the limit to check if there are more after.
    var postData = undefined
    if (req.query.owner === undefined) {
        postData = await Post.find({}).sort({"createdAt": -1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit) + 1)
    } else {
        const user = await User.findById(req.query.owner)
        await user.populate("posts").execPopulate()
        postData = user.posts
    }
    let morePosts = postData.length > req.query.limit
    if (morePosts) postData.pop()
    let posts = []
    for (let i = 0; i < postData.length; i++) {
        let currPost = postData[i].toObject()
        let user = await User.findById(currPost.author)
        if (!user) {
            continue
        }
        posts.push({
            id: currPost._id,
            title: currPost.title,
            author: user.username,
            contents: currPost.contents.substr(0, 100) + "...",
            preformattedTags: currPost.tags.split(" ").map((tag) => { return `<p>${tag}</p>` }).join("")
        })
    }
    res.send({ posts, skipQuery: req.query.skip, limitQuery: req.query.limit, morePosts })
})

module.exports = postsRouter