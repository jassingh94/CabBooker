const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/** @type {*} */
const eventSchema = new Schema({
    name: String,
    car: String,
    gender: String,
    location: String
});

/**
 *
 *
 * @param {*} mongoose
 * @return {*} 
 */
module.exports.get = (mongoose) => {

    return mongoose.model('driver', eventSchema);
}