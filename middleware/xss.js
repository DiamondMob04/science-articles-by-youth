var sanitizeHtml = require('sanitize-html');

const stripXSS = (req, res, next) => {
    if (req.method === "POST") {
        Object.keys(req.body).forEach((key) => { req.body[key] = sanitizeHtml(req.body[key]) })
    }
    next()
}

module.exports = stripXSS