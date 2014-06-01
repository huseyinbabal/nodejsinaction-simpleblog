module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var UserSchema = new Schema({
        name: String,
        email: String,
        passowrd: String,
        registerDate: {
            type: Date,
            default: Date.now
        }
    });
    mongoose.model( 'User', UserSchema );
}