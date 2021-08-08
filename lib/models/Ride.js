const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/** @type {*} */
const eventSchema = new Schema({
    id: String,
    date: Date,
    driver: { type: Schema.Types.ObjectId, ref: 'driver' },
    rider: { type: Schema.Types.ObjectId, ref: 'rider' },
    fromLocation: String,
    toLocation: String,
    state : String
});

/**
 *
 *
 * @param {*} mongoose
 * @return {*} 
 */
module.exports.get = (mongoose) => {

    return mongoose.model('ride', eventSchema);
}