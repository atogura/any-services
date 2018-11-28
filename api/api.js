module.exports = (function() {
    var router = require('express').Router();

    router.use('/users', require('./entities/users/users.routes'));
    router.use('/authenticate', require('./entities/auth/auth.routes'));
    router.use('/posts', require('./entities/posts/posts.routes'));
    //router.use('/post', require('./entities/post/post-routes'));

    router.post('/clean' , (req,res) => {
        let Post = require('./entities/posts/post.model');

        Post.remove({}).then( (res) => {
            res.send(res);
        }).catch( e => {
            res.send(e);
        });
    });
    return router;
})();