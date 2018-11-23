module.exports = (function() {
    let router = require('express').Router();
    let User = require('./user.model');

    router.post('/',function(req,res){
        if( !req.body.login || 
            !req.body.password || 
            !req.body.name ) {
            res.status(400);
            res.send({message: 'Login, password and name must be passed!'});
            return;
        }

        let newUser = {
            login: req.body.login,
            password: req.body.password,
            name: req.body.name
        }

        User.findOne({login: newUser.login})
        .then(user => {
            if(user){
                res.status(400);
                res.send({message: 'User already registered'});
                return;
            }
            newUser = new User(newUser);
            return newUser.save();
        }).then( user => {
            res.status(201);
            res.send({
                message: 'User created'
            }); 
            return;
        })
        .catch(error => {
            res.status(500);
            res.send(error);
            return;
        });
    });

    router.get('/', function(req, res) {
        let query = User.find({}, 'login name photo_url');
        query.sort({'createdAt': -1});

        return query.exec()
        .then( users => {
            res.status(200);
            res.send(users);
        })
        .catch(error => {
            res.status(500);
            res.send(error);
            return;
        });
    });

    return router;
})();