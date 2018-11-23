var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    login : { type : String, required : [true, 'username is required'] },
    password : { type : String, required : [true, 'password is required'] },
    name : { type: String, require: [true, 'name is required'] },
    photo_url: { type: String }
}, {timestamps: true});

var User = mongoose.model('User', UserSchema);

module.exports = User;