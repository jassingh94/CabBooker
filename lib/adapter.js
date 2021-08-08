const mongoose = require('mongoose')
const User = require('./models/User')
const Driver = require('./models/Driver')
const Ride = require('./models/Ride')
/**
 *
 * Adapter class creates models for mongoose
 * @class Adapter
 */
class Adapter {
    /**
     * Creates an instance of Adapter.
     * @memberof Adapter
     */
    constructor() {
        let mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        mongoose.connect(`${process.env.MONGO || "mongodb://localhost/"}${process.env.DB || "cab-booker"}`, mongooseOptions)

        this.models = {
            User: User.get(mongoose),
            Driver: Driver.get(mongoose),
            Ride: Ride.get(mongoose)
        }
    }

    /**
     * Gets model
     *
     * @param {*} modelName
     * @return {*} 
     * @memberof Adapter
     */
    get(modelName) {
        return this.models[modelName]
    }
}
module.exports = Adapter