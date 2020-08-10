const mongoose = require("mongoose")
const Filter = require("bad-words")

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 8,
        validate(val) {
            const filter = new Filter()
            if (filter.isProfane(val)) {
                throw new Error("We have detected profanity and your content has not been posted.")
            }
        }
    },
    author: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true,
        minlength: 100
    },
    tags: {
        type: String,
        required: true,
        validate(val) {
            if (val.split(" ").length === 0) {
                throw new Error("Please provide at least one tag for your article's content!")
            }
        }
    }
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel