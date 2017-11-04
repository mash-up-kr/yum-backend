const express = require('express');
const router = express.Router();
const PostModel = require('../routes/post');

/**
 * 게시글 업로드
 *
 * Request
 */
router.post('/upload', (req, res, next) => {

    let info = {

    };

    PostModel.uploadPost()
});


/**
 *  Get Feed
 *
 *  Request
 */
router.get('/get_feed', (req, res, next) => {

});

/**
 *  HashTag or Calorie Search
 *
 *  (/search?hashtag&calorie)
 *  Request
 *
 */
router.get('/search', (req, res, next) => {

});



module.exports = router;
