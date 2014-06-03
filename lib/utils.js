var crypto = require("crypto");
var utils = {
    connectToDatabase:function (mongoose, config, cb) {
        var dbPath;

        dbPath = "mongodb://" + config.USER + ":";
        dbPath += config.PASS + "@";
        dbPath += config.HOST + ((config.PORT.length > 0) ? ":" : "");
        dbPath += config.PORT + "/";
        dbPath += config.DATABASE;
        return mongoose.connect(dbPath, cb);
    },
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/signin')
    },
    toMd5: function(pwd, cb) {
        return crypto.createHash('md5').update(pwd).digest('hex');
    }
};
module.exports = utils;