const express = require("express")
const auth = require("../middleware/auth")
const Post = require("../models/post")
const User = require("../models/user")

const postsRouter = express.Router()

const toIdentifier = (word) => {
    return word.trim().toLowerCase().replace(/[^a-zA-Z]/g, "")
}
const styleFormat = (word) => {
    return word.replace(/<[a-zA-Z]+>/g, "").replace(/\b[^\s]{18,}\b/g, (w) => { 
        return `<span style="word-break: break-all !important;">${w}</span>` 
    })
}

postsRouter.get("/article/:id", async (req, res) => {
    try {
        const post = await Post.findOne({identifier: req.params.id})
        if (!post) throw new Error("")
        res.status(200).render("publicarticle", {
            title: post.title,
            author: post.author,
            contents: styleFormat(post.contents),
            imageLink: (post.thumbnail) ? `/image/${post.thumbnail}` : "/img/space-bg.jpg",
            identifier: post.identifier
        })
    } catch (error) {
        return res.redirect(400, "/error")
    }
})

postsRouter.post("/post", auth, async (req, res) => {
    try {
        req.body.author = req.session.user.username
        req.body.identifier = toIdentifier(req.body.title)
        const duplicatePost = await Post.findOne({identifier: req.body.identifier})
        if (duplicatePost) throw new Error("")
        myPost = new Post(req.body)
        await myPost.save()
        return res.status(200).send({url: "/article/" + myPost.identifier})
    } catch(error) {
        if (!error.errors) { return res.status(400).send({error: "An unexpected problem occurred."}) }
        return res.status(400).send({error: error.errors})
    }
})

postsRouter.patch("/post/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["title", "contents", "tags", "thumbnail"]
    const validBody = updates.every((update) => allowedUpdates.includes(update))
    if (!validBody) {
        return res.sendStatus(400)
    }
    const post = await Post.findOne({identifier: req.params.id})
    if (!post) {
        return res.sendStatus(404)
    }
    try {
        post.identifier = toIdentifier(req.body.title)
        updates.forEach((update) => post[update] = req.body[update])
        await post.save()
        return res.status(200).send({url: "/article/" + post.identifier})
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
        postData = await Post.find({author: req.query.owner}).sort({"createdAt": -1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit) + 1)
    }
    let morePosts = postData.length > req.query.limit
    if (morePosts) postData.pop()
    let posts = []
    for (let i = 0; i < postData.length; i++) {
        let currPost = postData[i].toObject()
        let user = await User.findOne({username: currPost.author})
        if (!user) {
            continue
        }
        posts.push({
            identifier: currPost.identifier,
            title: currPost.title,
            author: user.username,
            thumbnail: currPost.thumbnail,
            contents: currPost.contents.substr(0, 100) + "...",
            preformattedTags: currPost.tags.split(" ").map((tag) => { return `<p>${tag}</p>` }).join("")
        })
    }
    res.send({ posts, skipQuery: req.query.skip, limitQuery: req.query.limit, morePosts })
})

postsRouter.get("/edit/:id", auth, async (req, res) => {
    try {
        const post = await Post.findOne({identifier: req.params.id})
        if (!post || post.author !== req.session.user.username) {
            throw new Error("")
        }
        return res.render("edit", {
            title: post.title,
            contents: post.contents,
            tags: post.tags,
            imageLink: (post.thumbnail) ? `/image/${post.thumbnail}` : "/img/space-bg.jpg"
        })
    } catch(error) {
        res.status(400).redirect("/error")
    }
})

postsRouter.delete("/delete-article", auth, async (req, res) => {
    try {
        const post = await Post.findOne({identifier: req.body.identifier})
        if (!post || post.author !== req.session.user.username) {
            throw new Error("")
        }
        post.delete()
        res.sendStatus(200)
    } catch(error) {
        res.sendStatus(400)
    }
})

module.exports = postsRouter