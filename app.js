var express            = require("express");
var bodyParser         = require("body-parser");
var morgan             = require("morgan");
var methodOverride     = require("method-override");
var mongoose           = require("mongoose");
var config             = require("config");
var utils              = require("./lib/utils");
var mongooseConnection = utils.connectToDatabase(mongoose, config.db);
var passport           = require('passport');
var session            = require("express-session");
var sessionStore       = require('connect-redis')(session);
var cookieParser       = require('cookie-parser');
var flash              = require("connect-flash");

var app                = express();

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev') ); // Log every request to console
app.use(bodyParser()) ; // Pull information from POST request
app.use(methodOverride() ); // Simulate DELETE and PUT
app.use(cookieParser());
app.use(session({
    secret: 'myHighSecurePassword',
    store: new sessionStore({url:process.env.REDISTOGO_URL}),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require("./lib/views"));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade'); // I will use jade
app.set('view options', { layout: true }); // I will use jade's layout structure(i.e master page)

require("./models/User")(mongooseConnection);
require("./models/Comment")(mongooseConnection);
require("./models/Article")(mongooseConnection);

require("./lib/passport")();

require("./controllers/IndexController")(app, mongooseConnection);
require("./controllers/ArticleController")(app, mongooseConnection);
require("./controllers/CommentController")(app, mongooseConnection);
require("./controllers/UserController")(app, mongooseConnection);

app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
