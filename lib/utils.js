var utils = {
    connectToDatabase:function (mongoose, config, cb) {
        var dbPath;

        dbPath = "mongodb://" + config.USER + ":";
        dbPath += config.PASS + "@";
        dbPath += config.HOST + ((config.PORT.length > 0) ? ":" : "");
        dbPath += config.PORT + "/";
        dbPath += config.DATABASE;
        return mongoose.connect(dbPath, cb);
    }
};
module.exports = utils;