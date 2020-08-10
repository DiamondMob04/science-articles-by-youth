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
    contents: {
        type: String,
        required: true,
        minlength: 100
    }
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel