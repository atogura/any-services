module.exports = (function() {
    let router = require('express').Router();
    let User = require('../users/user.model');
    let tokenHandler = require('../../../utils/token');
    
    router.post('/',function(req,res){
        User.findOne({login: req.body.login, password: req.body.password}, 'login name photo_url')
        .then(user => {
            if( !user ){
                res.status(401);
                res.send({message: 'Wrong credentials'});
                return;
            }
            
            res.status(200);
            res.send({
                token : tokenHandler.createToken(user._id),
                userId: user._id,
                name: user.name
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