module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var CommentSchema = new Schema({
        text: String,
        author: String,
        createDate: {
            type: Date,
            default: Date.now
        }
    });
    mongoose.model( 'Comment', CommentSchema );
}
