const mongoose = require("mongoose")
const Filter = require("bad-words")

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 30,
        validate(val) {
            const filter = new Filter()
            if (filter.isProfane(val)) {
                throw new Error("We have detected profanity and your content has not been posted.")
            }
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    contents: {
        type: String,
        required: true,
        minlength: 200
    },
    thumbnail: {
        type: Buffer
    },
    tags: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            val.split(" ").forEach((tag) => {
                if (tag.length < 3 || tag.length > 12) {
                    throw new Error("All tags must be in between 3-12 characters long!")
                }
            })
            if (val.length === 0) {
                throw new Error("Please provide at least one tag for your article's content!")
            }
        }
    }
}, {
    timestamps: true
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel