const nodemailer = require("nodemailer")
const express = require("express")
const User = require("../models/user")
const auth = require("../middleware/auth")
const recentlysent = require("../middleware/recentlysent")

const emailRouter = express.Router()

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (mailOptions) => {
    const res = await transporter.sendMail(mailOptions)
    return res.accepted.length > 0
}

/*
name: $("#edit-name").val(),
email: $("#edit-email").val(),
editExperience: $("#edit-exp").val(),
writeExperience: $("#edit-write-exp").val(),
feedback: $("#edit-feedback").val(),
changes: $("#edit-changes").val(),
reason: $("#edit-why").val()
*/

emailRouter.get("/recently-sent", auth, recentlysent, (req, res) => {
    return res.sendStatus(200)
})

emailRouter.post("/editor-form", recentlysent, async (req, res) => {
    const allowed = ["name", "email", "editExperience", "writeExperience", "feedback", "changes", "reason"]
    const isValid = Object.keys(req.body).every(attr => attr.length > 0 && allowed.includes(attr))
    if (!isValid) return res.sendStatus(400)
    var mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: 'sciencearticlesbyyouth@gmail.com',
        subject: `Incoming Editor Form from ${req.body.name}`,
        html: `<h3>Full Name</h3><br>
        ${req.body.name}<br>
        <h3>Email</h3><br>
        ${req.body.email}<br>
        <h3>Have you had prior editing experience? Please describe if so. If not, put N/A.</h3><br>
        ${req.body.editExperience}<br>
        <h3>Have you had prior writing experience? Please describe if so. If not, put N/A.</h3><br>
        ${req.body.writeExperience}<br>
        <h3>What's your approach to giving constructive feedback to our fellow SAY writers?</h3><br>
        ${req.body.feedback}<br>
        <h3>What methods/changes would you suggest to an article to create more engaging content?</h3><br>
        ${req.body.changes}<br>
        <h3>Why do you want this role, and what skills/qualities do you have that can help contribute to this role?</h3><br>
        ${req.body.reason}`
    };
    const emailSent = await sendEmail(mailOptions)
    if (emailSent) {
        let formUser = await User.findOne({_id: req.session.user._id})
        formUser.lastFormSubmitted = new Date()
        await formUser.save()
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

/*
name: $("#amb-name").val(),
email: $("#amb-email").val(),
ambExperience: $("#amb-exp").val(),
publishing: $("#amb-article").val(),
attract: $("#amb-attract").val(),
describe: $("#amb-describe-say").val(),
socialMedia: $("#amb-social-media").val()
*/

emailRouter.post("/ambassador-form", recentlysent, async (req, res) => {
    const allowed = ["name", "email", "ambExperience", "publishing", "attract", "describe", "socialMedia"]
    const isValid = Object.keys(req.body).every(attr => attr.length > 0 && allowed.includes(attr))
    if (!isValid) return res.sendStatus(400)
    var mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: 'sciencearticlesbyyouth@gmail.com',
        subject: `Incoming Ambassador Form from ${req.body.name}`,
        html: `<h3>Full Name</h3><br>
        ${req.body.name}<br>
        <h3>Email</h3><br>
        ${req.body.email}<br>
        <h3>Have you written an article for SAY or are you in the publishing process?</h3><br>
        ${req.body.ambExperience}<br>
        <h3>Have you been an ambassador for other organizations before? If so, what organization and what did you do as an ambassador?</h3><br>
        ${req.body.publishing}<br>
        <h3>How would you attract and direct new people to SAY (utilizing social media)?</h3><br>
        ${req.body.attract}<br>
        <h3>Based on what you know about us, how would you describe SAY to another person?</h3><br>
        ${req.body.describe}<br>
        <h3>How would you describe your personal social media presence?</h3><br>
        ${req.body.socialMedia}`
    };
    const emailSent = await sendEmail(mailOptions)
    if (emailSent) {
        let formUser = await User.findOne({_id: req.session.user._id})
        formUser.lastFormSubmitted = new Date()
        await formUser.save()
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

module.exports = emailRouter