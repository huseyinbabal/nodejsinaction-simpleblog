var express            = require("express");
var bodyParser         = require("body-parser");
var morgan             = require("morgan");
var methodOverride     = require("method-override");
var mongoose           = require("mongoose");
var config             = require("config");
var utils              = require("./lib/utils");
var mongooseConnection = utils.connectToDatabase(mongoose, config.db);
var app                = express();

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev') ); // Log every request to console
app.use(bodyParser()) ; // Pull information from POST request
app.use(methodOverride() ); // Simulate DELETE and PUT

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade'); // I will use jade
app.set('view options', { layout: true }); // I will use jade's layout structure(i.e master page)

require("./models/Article")(mongooseConnection);
require("./models/User")(mongooseConnection);
require("./models/Comment")(mongooseConnection);

require("./controllers/IndexController")(app, mongooseConnection);
require("./controllers/ArticleController")(app, mongooseConnection);
require("./controllers/CommentController")(app, mongooseConnection);

app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
