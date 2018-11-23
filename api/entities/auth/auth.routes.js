module.exports = (function() {
    let router = require('express').Router();
    let User = require('../users/user.model');
    let crypto = require('crypto');
    
    router.post('/',function(req,res){
        User.findOne({login: req.body.login, password: req.body.password}, 'login name photo_url')
        .then(user => {
            if( !user ){
                res.status(401);
                res.send({message: 'Wrong credentials'});
                return;
            }

            let cipher = crypto.createCipher('aes192', 'meu password secreto');
            let token = 'oi' //(new Date()).getTime() + "." + userId;
            let encrypted = cipher.update(token, 'utf8', 'hex');

            res.status(200);
            res.send({
                token : encrypted
            }); 
            return;
        })
        .catch( error => {
            res.status(500);
            res.send(error);
            return; 
        });
    });

    return router;
})();