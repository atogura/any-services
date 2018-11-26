module.exports = (function() {
    let router = require('express').Router();
    let User = require('./user.model');
    let tokenHandler = require('../../../utils/token');
    let photoHandler = require('../../../utils/photo');

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

        let page = req.query.page;
        let pageSize = req.query.pageSize;
        if( !page ) page = 1;
        if( !pageSize ) pageSize = 5;

        if( page < 1 || pageSize < 1 ) {
            res.status(400);
            res.send('Bad parameters: page or pageSize');
            return;
        }

        query.skip((page-1)*pageSize*1);
        query.limit(pageSize*1 + 1);

        return query.exec()
        .then( users => {
            users.forEach( (user) => {
                user.photo_url = photoHandler.getProfilePhoto(user._id);    
            })

            let hasNext = false;
            if( users.length > pageSize ) {
                hasNext = true;
                users.pop();
            }

            res.status(200);
            res.send({
                hasNext: hasNext,
                users: users
            });
        })
        .catch(error => {
            res.status(500);
            res.send(error);
            return;
        });
    });

    router.put('/photo', (req,res) => {
        let user = '';
        try {
            user = tokenHandler.extractUser(req.headers['authorization']);
        } catch(e) {
            res.status(401);
            res.send(e);
            return;
        }
        
        User.findOne({_id: user})
        .then(user => {
            if( !user ) {
                res.status(404);
                res.send('User not found');
                return;
            }
            
            photoHandler.saveProfilePhoto( req.body.photo, user._id, (err) => {
                if( err ) {
                    res.status(500);
                    res.send(err);
                    return;
                }

                res.status(200);
                res.send({
                    login: user.login,
                    name: user.name,
                    photo_url: photoHandler.getProfilePhoto(user._id)
                });
                return;
            });
        })
        .catch(error => {
            res.status(500);
            res.send(error);
            return;
        });
    });

    return router;
})();