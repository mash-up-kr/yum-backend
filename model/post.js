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
                    return cb(null, result.insertId);
                }
            })
        }

        function insertOtherThings(id, cb) {
            async.parallel([
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
            let sql = "INSERT INTO post_image(post_id, img_url) VALUES(?,?);";

            dbConn.query(sql, [pid, info.postImgUrl], (err, result) => {
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

            for (i; i < info.hashtags.length; i++) {
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


/**
 *  Feed 가져오기. (post, image, hashtags)
 *
 * @param callback
 */
function getFeed(callback) {

    dbPool.getConnection((err, dbConn) => {
        if (err) throw err;


        let sql = "SELECT U.nickname, P.id, P.calorie, P.content, GROUP_CONCAT(distinct PI.img_url) AS img_url, " +
            "GROUP_CONCAT(distinct H.name) AS hashtags FROM " +
            "post P JOIN user U ON U.id=P.user_id JOIN post_image PI " +
            "ON P.id=PI.post_id JOIN hashtag H ON P.id=H.post_id GROUP BY P.id LIMIT 0, 1000";

        dbConn.query(sql, (err, results) => {
           if (err) {
               return callback(err);
           } else {
               return callback(null, results)
           }
        });
    })
}


module.exports.uploadPost = uploadPost;
module.exports.getFeed = getFeed;