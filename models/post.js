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
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }],
    verified: {
        type: Boolean,
        default: false
    },
    isPaper: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

postSchema.statics.findByKeywords = async function(keywords, options = { isPaper: false, skip: 0, limit: 3 }) {
    var posts = await mongoose.models["Post"].find({}).sort({"createdAt": -1})
    keywords = keywords.toLowerCase().split(" ")
    posts = posts.filter((post) => {
        var isMatch = false
        if (post.isPaper !== options.isPaper) return false;
        keywords.forEach((keyword) => {
            if (post.tags.toLowerCase().includes(keyword) || post.title.toLowerCase().includes(keyword)) {
                isMatch = true
            }
        })
        return isMatch
    })
    return posts.splice(options.skip, options.limit)
}

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel