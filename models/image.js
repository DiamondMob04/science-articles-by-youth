const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
    buffer: {
        type: Buffer,
        required: true
    },
}, {
    timestamps: true
})

const imageModel = mongoose.model("Image", imageSchema)

module.exports = imageModel