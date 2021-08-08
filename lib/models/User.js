const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/** @type {*} */
const eventSchema = new Schema({
    username: String,
    name: String,
    password: String,
    location: String
});

/**
 *
 *
 * @param {*} mongoose
 * @return {*} 
 */
module.exports.get = (mongoose) => {

    return mongoose.model('rider', eventSchema);
}