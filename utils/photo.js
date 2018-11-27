var fs = require('fs');
var path = require('path');

const fext = '.jpeg';

module.exports = {
    saveProfilePhoto : function( base64, userId, callback ) {
        let imgRaw = base64.replace(/^data:image\/jpeg;base64,/, "");
        let filePath = path.join(__dirname, '..', 'public', 'photos', 'profile', userId + fext);
        fs.writeFileSync(filePath, imgRaw, 'base64');
    },
    getProfilePhoto : function( userId ) {
        let filePath = path.join(__dirname, '..', 'public', 'photos', 'profile', userId + fext);
        try {
            if( fs.statSync(filePath) ) {
                return '/public/photos/profile/' + userId + fext;
            } else {
                return null
            }
        } catch(e) {
            return null;
        }
    },
    savePostPhoto : function( base64, postId, callback ) {
        console.log(postId);
        let imgRaw = base64.replace(/^data:image\/jpeg;base64,/, "");
        let filePath = path.join(__dirname, '..', 'public', 'photos', 'posts', postId + fext);
        console.log(filePath);
        fs.writeFile(filePath, imgRaw, 'base64', callback);
    },
    getPostURL : function( postId ) {
        return '/public/photos/posts/' + postId + fext;
    }
}