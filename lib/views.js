module.exports = function(req, res, next) {
    res.locals.req = req;
    next();
}