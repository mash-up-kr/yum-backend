const mysql = require('mysql');
const async = require('async');
const dbPoolConfig = require('../config/mysql_config');
const dbPool = mysql.createPool(dbPoolConfig);

//TODO 닉네임 중복체크 하기.
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

    dbPool.getConnection((err, dbConn) => {
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
                let sql = "INSERT INTO user(email, password, nickname) VALUES(?,?,?);";

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
 * 1. 아이디 존재 유무 검사
 * 2. 있을시 비밀번호 검사
 * 3.. 일치시 로그인
 */
function signIn(info, callback) {

    dbPool.getConnection((err, dbConn) => {
       if (err) {
           return callback(err);
       }

       async.waterfall([
           checkEmail,
           checkPassword,
       ], (err, result) => {
           if (err) {
               console.log(err);
               callback(err);
           } else {
               callback(null, result);
           }
       });

        function checkEmail(cb) {
            let sql = "SELECT email FROM user WHERE email=?;";

            dbConn.query(sql, [info.email], (err, result) => {
               if (err) {
                   console.log(err);
                   return cb(err);
               } else {
                   return cb(null, result.length);
               }
            });
        }

        function checkPassword(res, cb){
            if (res === 0) {
                return cb(null, 'NonExistEmail');
            } else if (res === 1) {
                let sql = "SELECT id, password FROM user WHERE email=?;";

                dbConn.query(sql, [info.email], (err, result) => {
                   if (err) {
                       console.log(err);
                       return cb(err);
                   } else {
                       if (result[0].password !== info.password) {
                           return cb(null, "DiscordPassword");
                       } else {
                           return cb(null, result[0].id);
                       }
                   }
                });
            }
        }
    });
}

module.exports.signUp = signUp;
module.exports.signIn = signIn;