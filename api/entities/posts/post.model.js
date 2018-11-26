var mongoose = require("mongoose");
var PostSchema = new mongoose.Schema({
    subtitle: { type : String },
    location: { type : String },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : [true, '_user is required']}
}, {timestamps: true});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;