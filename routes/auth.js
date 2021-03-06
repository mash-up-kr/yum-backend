const express = require('express');
const router = express.Router();
const AuthModel = require('../model/auth');

/**
 *  SignUp
 *
 *  Request
 *  - email
 *  - password
 *  - nickname
 *
 *  Response
 *  - message : String
 *  - code : Number
 */
router.post('/sign_up', (req, res, next) => {


    let info = {
        email : req.body.email,
        password : req.body.password,
        nickname : req.body.nickname
    };

    AuthModel.signUp(info, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result === 'ExistEmail') {
                return res.status(202).json({
                    message : 'ExistEmail',
                    code : 2
                })
            } else if (result === 'Success SignUp') {
                return res.status(200).json({
                    message : "Success",
                    code : 1
                })
            }
        }
    });

});

/**
 *  SignIn
 *
 *  Request
 *  - email
 *  - password
 *
 *  Response
 *  - message : String
 *  - code : Number
 *  - result : Number (Option)
 */
router.post('/sign_in', (req, res, next) => {

    let info = {
        email : req.body.email,
        password : req.body.password,
    };

    AuthModel.signIn(info, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            if (result === 'NonExistEmail') {
                return res.status(409).json({
                    message: 'NonExistEmail',
                    code: 2
                })
            } else if (result === 'DiscordPassword') {
                return res.status(409).json({
                    message: 'DiscordPassword',
                    code: 2
                })
            } else {
                return res.status(200).json({
                    message: 'Success',
                    code: 1,
                    userId: result
                })
            }
        }
    });

});

module.exports = router;
