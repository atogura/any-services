var fs = require('fs');
var path = require('path');

const fext = '.png';

module.exports = {
    saveProfilePhoto : function( base64, userId, callback ) {
        let imgRaw = base64.replace(/^data:image\/png;base64,/, "");
        let filePath = path.join(__dirname, '..', 'public', 'photos', 'profile', userId + fext);
        fs.writeFile(filePath, imgRaw, 'base64', callback);
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
    }
}