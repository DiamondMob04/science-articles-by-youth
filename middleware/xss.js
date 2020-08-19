var sanitizeHtml = require('sanitize-html');

const stripXSS = (req, res, next) => {
    if (req.method === "POST" || req.method == "PATCH") {
        Object.keys(req.body).forEach((key) => { req.body[key] = sanitizeHtml(req.body[key], {
            allowedTags: ["span", "b", "i", "u", "strike", "h2", "h3"],
            allowedAttributes: {
                span: [ "style" ]
            }
        }) })
    }
    next()
}

module.exports = stripXSS