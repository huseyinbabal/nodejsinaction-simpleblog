var mongoosastic = require("mongoosastic");
var config = require("config");
module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var Comment = mongoose.model("Comment");

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

    ArticleSchema.plugin(mongoosastic, {
        host: config.elasticsearch.host,
        port: config.elasticsearch.port,
        protocol: config.elasticsearch.protocol,
        index: config.elasticsearch.index,
        type: "article"
    });
    mongoose.model( 'Article', ArticleSchema );
}
