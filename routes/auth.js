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


});

/**
 *  SignIn
 */
router.post('/sign_in', (req, res, next) => {

});

module.exports = router;
