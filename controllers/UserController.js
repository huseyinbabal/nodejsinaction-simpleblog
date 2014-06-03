var passport = require("passport");

module.exports = function(app, mongoose) {

    var User = mongoose.model("User");

    app.route("/signup")
        .get(function(req, res) {
            res.render("signup");
        })
        .post(function(req, res, next) {
            passport.authenticate('local-signup', function(err, user, info) {
                if (err) { return next(err) }
                if (!user) {
                    return res.redirect('/signup')
                } else {
                    res.redirect("/signin");
                }
            })(req, res, next);
        });

    app.route("/signin")
        .get(function(req, res) {
            res.render("signin");
        })
        .post(function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) { return next(err) }
                if (!user) {
                    return res.redirect('/signin')
                }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect('/');
                });
            })(req, res, next);
        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}