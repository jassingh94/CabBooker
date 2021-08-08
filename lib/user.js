/**
 *
 * @class User
 */
class User {
    /**
     * Creates an instance of User.
     * @param {*} username
     * @param {*} password
     * @memberof User
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    location() { }
}


/**
 *
 *  Caches user per username
 * @class Users
 */
class Users {
    /**
     * Creates an instance of Users.
     * @param {*} username
     * @param {*} password
     * @memberof Users
     */
    constructor(username, password) {
        if (!Users.instance)
            Users.instance = {}

        if (!Users.instance[username])
            Users.instance[username] = new User(username, password)

        return Users.instance[username]
    }
}

module.exports = Users