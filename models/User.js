var crypto = require("crypto");

module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var UserSchema = new Schema({
        name: String,
        email: String,
        password: String,
        registerDate: {
            type: Date,
            default: Date.now
        }
    });

    UserSchema.methods.validPassword = function( pwd ) {
        return ( this.password === crypto.createHash('md5').update(pwd).digest('hex') );
    };
    mongoose.model( 'User', UserSchema );
}