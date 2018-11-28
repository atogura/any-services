module.exports = (function() {
    var router = require('express').Router();

    router.use('/users', require('./entities/users/users.routes'));
    router.use('/authenticate', require('./entities/auth/auth.routes'));
    router.use('/posts', require('./entities/posts/posts.routes'));
    //router.use('/post', require('./entities/post/post-routes'));

    router.post('/clean' , (req,res) => {
        
        res.send("Foi");
    });
    return router;
})();