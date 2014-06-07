var rtg   = require("url").parse(process.env.REDISTOGO_URL);
var redis = require("redis").createClient(rtg.port, rtg.hostname);
redis.auth(rtg.auth.split(":")[1]);

redis.on("error", function(err) {
    console.log("Redis Err: " + err);
})
module.exports = function(app) {

    app.all("*", function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:9000');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.get("/", function(req, res) {
        res.render("index");
    });

    app.get("/redis/set/:key/:val", function(req, res, next) {
        var key = req.params.key;
        var val = req.params.val;
        redis.set(key, val, redis.print);
        next("Key value pair added!");
    });

    app.get("/redis/get/:key", function(req, res, next) {
        var key = req.params.key;
        redis.get(key, function(err, data) {
            next(key + "=>" + data);
        })
    })

}