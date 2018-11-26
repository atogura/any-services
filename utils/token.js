let crypto = require('crypto');

module.exports = {
    createToken : function(userId) {
        let cipher = crypto.createCipher('aes192', 'meu password secreto');
        let token = (new Date()).getTime() + "." + userId;
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },
    extractUser : function(token) {
        let decipher = crypto.createDecipher('aes192', 'meu password secreto');
        let decrypted = decipher.update(token, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        let user = decrypted.split('.')[1];
        return user;
    }
};