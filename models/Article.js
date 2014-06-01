module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var Comment = require("./Comment");

    var ArticleSchema = new Schema({
        title: String,
        content: String,
        author: String,
        comments: [Comment.schema],
        createDate: {
            type: Date,
            default: Date.now
        }
    });
    mongoose.model( 'Article', ArticleSchema );
}