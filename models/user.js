const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const bcrypt = require("bcryptjs")

/*
Roles:
Member - Can only view articles. 
Author - Can write and submit articles (must be pre-approved).
Admin - Can write and submit articles.
*/ 

const availableRoles = ["member", "author", "admin"]

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("That email is not valid.")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function() {
    const user = this.toObject()
    delete user._id
    delete user.password
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET, {expiresIn: "7 days"})
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async function(username, password) {
    const user = await mongoose.models["User"].findOne({username})
    if (!user) {
        return {error: "Username or password is incorrect."}
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return {error: "Username or password is incorrect."}
    }
    return user
}

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})  

const userModel = mongoose.model("User", userSchema)

module.exports = userModel