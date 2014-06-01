module.exports = function(app) {

    app.get("/", function(req, res) {
        res.render("index");
    });

    app.post("/signin", function(req, res) {
       res.json({message: "Sigin post request"});
    });

    app.get("/user/:id", function(req, res) {
       var id = req.params.id;
        res.json({userid: id});
    });

    app.post("/user/create", function(req, res) {
       var id = req.body.id;
        res.json({user: id});
    });
}