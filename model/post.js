const mysql = require('mysql');
const dbPoolConfig = require('../config/mysql_config');
const dbPool = mysql.createPool(dbPoolConfig);
const async = require('async');


/**
 * Post 업로드.
 *
 * @param info
 * @param callback
 */
function uploadPost(info, callback) {

    dbPool.getConnection((err, dbConn) => {
        if (err) throw err;

        async.waterfall([
            insertPost,
            insertOtherThings
        ], (err, result) => {
           if (err) {
               console.log(err);
               return callback(err);
           } else {
               return callback(null, result);
           }
        });

        function insertPost(cb) {
            let sql = "INSERT INTO post(user_id, content, calorie) VALUES(?,?,?);";

            dbConn.query(sql, [info.userId, info.content, info.calorie], (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, 'Success Post');
                }
            })
        }

        function insertOtherThings(id, cb) {
            async.parellel([
                insertImage.bind(null, id),
                insertHashTag.bind(null, id)
            ], (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, 'Success Inserts');
                }
            })
        }

        function insertImage(pid, cb) {
            let sql = "INSERT INTO post_image(img_url) VALUES(?);";

            dbConn.query(sql, [info.postImgUrl], (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, 'Success Image');
                }
            })
        }

        function insertHashTag(pid, cb) {
            let hashtag = [];
            let i = 0;

            for (i; i<info.hashtags.length; i++) {
                hashtag.push([
                    pid,
                    info.hashtags[i]
                ])
            }

            let sql = "INSERT INTO hashtag(post_id, name) VALUES ?;";

            dbConn.query(sql, [hashtag], (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, 'Success hashTag');
                }
            })
        }
    });
}


module.exports.uploadPost = uploadPost;