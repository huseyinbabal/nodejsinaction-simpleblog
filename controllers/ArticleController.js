module.exports = function(app, mongoose) {

    var Article = mongoose.model("Article");

    app.get("/article/new", function(req, res) {
        res.render("article-new");
    });

    app.post("/article/create", function(req, res) {
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
                res.redirect("/article/show/" + id);
            }
        })
    });

    app.get("/article/show/:id", function(req, res) {
        var id = req.params.id;
        Article.findOne({"_id": id}, function(err, data) {
            if (err) {
                res.render("error", {err: err});
            } else {
                res.render("article-detail", {
                    articleInfo: data
                });
            }
        })
    });
}