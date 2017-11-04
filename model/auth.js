const mysql = require('mysql');
const async = require('async');
const dbPoolConfig = require('../config/mysql_config');
const dbPool = mysql.createPool(dbPoolConfig);

/**
 * 회원가입
 *
 * @param info
 * @param callback
 *
 * Exception
 * - 아이디 존재 할시, Return
 * - 없을시 회원가입.
 */
function signUp(info, callback) {

    dbPool.getConnections((err, dbConn) => {
        if (err) {
            return callback(err);
        }

        async.waterfall([
            checkUserEmail,
            userSignUp
        ], (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        });


        function checkUserEmail(cb) {

            let sql = "SELECT email FROM user WHERE email=?";

            dbConn.query(sql, [info.email], (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result.length);
                }
            });
        }

        function userSignUp(len, cb) {

            if (len === 1) {
                return cb(null, "ExistEmail")
            } else if (len === 0) {
                let sql = "INSERT INTO USER(email, password, nickname) VALUES(?,?,?);";

                dbConn.query(sql, [info.email, info.password, info.nickname], (err, result) => {
                    if (err) {
                        return cb(err);
                    } else {
                        return cb(null, 'Success SignUp');
                    }
                });
            } else {
                throw err
                // Error
            }
        }
    });
}

/**
 *  로그인
 *
 * @param info
 * @param callback
 *
 *  * Exception
 * - 아이디 없을시
 * - 비밀번호 불일치시
 * - 등..
 */
function signIn(info, callback) {

}

module.exports.signUp = signUp;
module.exports.signIn = signIn;