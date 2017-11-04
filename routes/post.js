const express = require('express');
const router = express.Router();
const PostModel = require('../model/post');
const upload = require('../service/upload');
const uploadPostImg = upload.uploadPostImg.single('postImg');

/**
 * 게시글 업로드
 *
 * Request
 */
router.post('/upload', uploadPostImg, (req, res, next) => {


    let info = {
        userId : req.body.userId,
        content : req.body.content,
        postImgUrl : req.file.location,
        calorie : req.body.calorie,
        hashtags : req.body.hashtags
    };

    console.log(typeof info.hashtags);

    PostModel.uploadPost(info, (err, result) => {
        if (err) {
            throw err
        } else {
            return res.status(200).json({
                message: result,
                code: 1
            })
        }
    })
});


/**
 *  Get Feed
 *
 *  Request
 */
router.get('/get_feed', (req, res, next) => {

    PostModel.getFeed((err, results) => {
        if (err) {
            throw err;
        } else {
            return res.status(200).json({
                message: 'Success',
                code: 1,
                results: results
            })
        }
    })
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
