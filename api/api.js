module.exports = (function() {
    var router = require('express').Router();

    router.use('/users', require('./entities/users/users.routes'));
    router.use('/authenticate', require('./entities/auth/auth.routes'));
    //router.use('/posts', require('./entities/feed/feed-routes'));
    //router.use('/post', require('./entities/post/post-routes'));

    return router;
})();