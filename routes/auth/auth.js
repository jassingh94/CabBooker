var passport = require('./../../lib/passport');


/**
 *
 *
 * @param {*} e
 * @param {*} app
 */
module.exports.register = (e, app) => {

    app.get('/login', function (req, res, next) {
        if (!(req?.query?.username) || !(req?.query?.password))
            throw new Error('Username and password not specified')

        passport.login(req.e, req.query.username, req.query.password)
            .then(result => {
                req.session.bookerToken = result
                res.send("Logged In")
            })
            .catch(err => {
                throw new Error(err)
            })
    });



    app.get('/logout', function (req, res, next) {
        req.session.destroy();
        res.send('Logged Out');
    });

}