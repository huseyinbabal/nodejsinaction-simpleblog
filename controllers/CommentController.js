module.exports = function(app, mongoose) {

    var Article = mongoose.model("Article");
    var Comment = mongoose.model("Comment");

    app.post("/comment/create", ensureAuthenticated, function(req, res) {
        var text = req.body.text;
        var articleID = req.body.articleId;

        Article.findOne({"_id": articleID}, function(err, data) {
            if(err || typeof data == 'undefined') {
                res.render("error", {err: err});
            } else {
                var commentModel = new Comment();
                commentModel.text = text;
                commentModel.author = "anonymous";
                data.comments.push(commentModel);
                data.save(function(err, data) {
                    if (err) {
                        res.render("error", {err: err});
                    } else {
                        res.redirect("/article/show/" + articleID);
                    }
                })
            }
        })
    });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}