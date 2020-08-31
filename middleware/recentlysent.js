var numDaysBetween = function(d1, d2) {
    var diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
};

const recentlysent = async (req, res, next) => {
    try {
        const user = req.session.user
        if (!user) {
            throw new Error("User is not authenticated.")
        }
        if (!user.lastFormSubmitted) {
            return next()
        }
        if (numDaysBetween(new Date(), user.lastFormSubmitted) < 3) {
            throw new Error()
        }
        next()
    } catch (error) {
        res.sendStatus(400)
    }
} 

module.exports = recentlysent