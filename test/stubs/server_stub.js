const e = require('./../../lib/engine')
const memoryMongo = require('./memory_mongo')
require('dotenv').config()


module.exports = () => {
    return new Promise((resolve, reject) => {

        memoryMongo()
            .then(({ mongod, uri }) => {
                process.env.MONGO = uri
                let engine = e
                    .init()
                    .start();
                resolve({ engine, mongod, uri })
            })
            .catch(reject)

        // initialize & start engine

    })
}