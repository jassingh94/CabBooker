const User = require('./user');
const jwt = require('jsonwebtoken')


/**
 *
 *  Logins a user and creates jwt token
 * @param {*} e
 * @param {*} user
 * @param {*} pass
 * @return {*} 
 */
module.exports.login = function (e, user, pass) {
    return e.adapter.get('User').findOne({
        user: user?.username
    })
        .exec()
        .then(data => {
            if (!data || !data.password)
                return Promise.reject("Invalid credentials")
            let details = {
                username: user,
                password: pass
            }
            new User(user, pass)
            const signature = 'mBooker---auth---jwt';
            const expiration = '6h';
            return Promise.resolve(jwt.sign({ details, }, signature, { expiresIn: expiration }));
        })
};

/**
 *
 * Finds user and creates user class if needed
 * @param {*} e
 * @param {*} user
 * @param {*} pass
 * @return {*} 
 */
module.exports.user = function (e, user, pass) {
    return e.adapter.get('User').findOne({
        user: user?.username
    })
        .exec()
        .then(data => {
            if (data && data.password === pass) {
                return Promise.resolve(new User(user, pass))
            }
            else
                return Promise.reject("Invalid login credentials")
        })
};