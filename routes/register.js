const auth = require('./auth/auth');
const book = require('./index')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken')
const passport = require('./../lib/passport')
const sessions = require('express-session');

/**
 *
 *
 * @param {*} e
 * @param {*} app
 */
module.exports = function (e, app) {
    app.use(cookieParser());
    app.use(sessions({ secret: "mBooker---auth---jwt" }));
    app.use(checkIfLoggedIn.bind(null, e));
    app.use(function (err, req, res, next) {
        res.status(500).send({ err: err?.message || err })
    })
    auth.register(e, app);
    book.register(e, app);
}

/**
 *
 *
 * @param {*} e
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function checkIfLoggedIn(e, req, res, next) {
    req.e = e;
    if (req.url.indexOf(`/login`) > -1 || req.url.indexOf(`/favicon.ico`) > -1)
        next()
    else
        checkLogin(e, req)
            .then(() => {
                next()
            })
            .catch(next)
}

/**
 *
 *
 * @param {*} e
 * @param {*} req
 * @return {*} 
 */
function checkLogin(e, req) {
    return new Promise((resolve, reject) => {
        if (!(req?.session?.bookerToken) && (!req?.query?.username || !req?.query?.password)) {
            reject('User not logged in');
        }
        else if (req?.session?.bookerToken) {
            deserialize(e, req?.session?.bookerToken)
                .then((user) => {
                    req.user = user;
                    resolve();
                })
                .catch(reject)
        }
        else {
            loginUser(e, req?.query?.username, req?.query?.password)
                .then((user) => {
                    passport.login(e, req?.query?.username, req?.query?.password)
                        .then(token => {
                            req.session.bookerToken = token
                            req.user = user;
                            resolve();
                        })
                        .catch(reject)
                })
                .catch(reject)
        }

    })
}

/**
 *
 *
 * @param {*} e
 * @param {*} cookie
 * @return {*} 
 */
function deserialize(e, cookie) {
    let userDetails = jwt.verify(cookie, 'mBooker---auth---jwt')
    return loginUser(e, userDetails?.details?.username, userDetails?.details?.password)
}

/**
 *
 *
 * @param {*} e
 * @param {*} username
 * @param {*} password
 * @return {*} 
 */
function loginUser(e, username, password) {
    return passport.user(e, username, password)
}