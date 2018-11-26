module.exports = (function() {
    let router = require('express').Router();
    let Post = require('../posts/post.model');
    let User = require('../users/user.model');
    let tokenHandler = require('../../../utils/token');
    let photoHandler = require('../../../utils/photo');
    
    router.get('/', function(req,res) {
        let mine = req.query.mine;
        let page = req.query.page;
        let pageSize = req.query.pageSize;

        if( !page ) page = 1;
        if( !pageSize ) pageSize = 5;

        if( page < 1 || pageSize < 1 ) {
            res.status(400);
            res.send('Bad parameters: page or pageSize');
            return;
        }

        let query = Post.find({}, 'subtitle location user');
        query.sort({'createdAt': -1});
        query.populate('user', 'name photo_url');
        query.skip((page-1)*pageSize*1);
        query.limit(pageSize*1 + 1);
        query.exec()
        .then( posts => {
            let hasNext = false;
            if( posts.length > pageSize ) {
                hasNext = true;
                posts.pop();
            }

            posts.forEach( (post) => {
                post.photo_url = photoHandler.getPostURL(post._id);
                post.user.photo_url = photoHandler.getProfilePhoto(post.user._id);    
            })

            
            res.send({
                hasNext : hasNext,
                posts : posts
            });
        })
        .catch( e => {
            res.status(500);
            res.send(e);
        })

    });

    router.post('/',function(req,res){
        let user = '';
        try {
            user = tokenHandler.extractUser(req.headers['authorization']);
        } catch(e) {
            res.status(401);
            res.send(e);
            return;
        }

        let newPost = {
            subtitle: req.body.subtitle ? req.body.subtitle : null,
            location: req.body.location ? req.body.location : null
        }
        let imgRaw = req.body.photo;

        if( !req.body.photo ) {
            res.status(400);
            res.send('Photo is required');
            return;
        }

        User.findOne({_id: user})
        .then(user => {
            if( !user ) {
                res.status(404);
                res.send('User not found');
                return;
            }
            
            let postDoc = new Post(newPost);
            postDoc.user = user._id;
            return postDoc.save();
        })
        .then( post => {
            console.log('A' );

            photoHandler.savePostPhoto( imgRaw, post._id, (err)=> {
                if( err ) {
                    res.status(400);
                    res.send('Invalid image');
                    return;
                }
                console.log('V' );

                res.status(201);
                res.send({
                    subtitle: post.subtitle,
                    location: post.location,
                    photo_url: photoHandler.getPostURL(post._id)
                });
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