var passport = require("passport");
var ironCache = require("iron-cache");
var client = ironCache.createClient();
var jsonSerializer = require("node-serialize");
var config = require("config");

var iron_mq = require("iron_mq");
var imq = new iron_mq.Client({
    token: config.ironmq.token,
    project_id: config.ironmq.project,
    queue_name: "article"
});
var queue = imq.queue("article");

module.exports = function(app, mongoose) {

    var Article = mongoose.model("Article");

    app.get("/article/new", ensureAuthenticated, function(req, res, next) {
        res.render("article-new");
    });

    app.post("/article/create", ensureAuthenticated, function(req, res) {
        var title = req.body.title;
        var content = req.body.content;
        var articleModel = new Article();
        articleModel.title = title;
        articleModel.content = content;
        articleModel.author = "anonymous";
        articleModel.save(function(err, data) {
            if (err) {
                res.render("error", {err: err});
            } else {
                var id = data._id;
                queue.post({body: id}, function(err, body) {
                   console.log("Message sent: " + id);
                });
                res.redirect("/article/show/" + id);
            }
        })
    });

    app.get("/article/show/:id", function(req, res) {
        var id = req.params.id;
        client.get("article", id, function(err, data) {
            if (data) {
                console.log(id + " get from cache");
                res.render("article-detail", {
                    articleInfo: jsonSerializer.unserialize(data.value)._doc
                });
            } else {
                Article.findOne({"_id": id}, function(err, data) {
                    if (err) {
                        res.render("error", {err: err});
                    } else {
                        client.put("article", id, {value: jsonSerializer.serialize(data)}, function(err, res) {
                            console.log(id + " put into cache");
                        })
                        res.render("article-detail", {
                            articleInfo: data
                        });
                    }
                })
            }
        })
    });

    app.get("/article/search/:keyword", function(req, res, next) {
        var keyword = req.params.keyword;
        Article.search({
            query: {
                query_string: {
                    fields: ["content"],
                    query: keyword
                }
            }
        }, function(err, docs) {
            res.json(docs);
        })
    });

    app.get("/queue/read", function(req, res, next) {
        queue.get({queue_name: "article"}, function(err, body) {
            if (body) {
                queue.del(body.id, function(err, body) {
                    console.log(body.id + " deleted");
                })
                next(body.id);
            } else {
                next("There is no message in the queue");
            }
        })
    })
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}