const mongoose = require("mongoose")
const Filter = require("bad-words")

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
        validate(val) {
            const filter = new Filter()
            if (filter.isProfane(val)) {
                throw new Error("We have detected profanity and your content has not been posted.")
            }
        }
    },
    identifier: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true,
        minlength: 200
    },
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId
    },
    tags: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            val.split(" ").forEach((tag) => {
                if (tag.length < 3 || tag.length > 16) {
                    throw new Error("All tags must be in between 3-16 characters long!")
                }
            })
            if (val.length === 0) {
                throw new Error("Please provide at least one tag for your article's content!")
            }
        }
    },
    comments: [{
        author: {
            type: String
        },
        contents: {
            type: String,
            minlength: 1,
            validate(val) {
                const filter = new Filter()
                if (filter.isProfane(val)) {
                    throw new Error("We have detected profanity and your content has not been posted.")
                }
            }
        }
    }]
}, {
    timestamps: true
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel