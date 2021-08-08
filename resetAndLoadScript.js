const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const url = process?.env?.MONGO || 'mongodb://localhost:27017'
const dbName = process?.env?.DB || 'cab-booker'
const client = new MongoClient(url)

/**
 *
 *
 * @return {*} 
 */
async function run() {

    await client.connect()
    console.log('Connected to server')

    const db = client.db(dbName)

    // assign all collections
    const colDrivers = db.collection('drivers')
    const colRiders = db.collection('riders')
    const colRides = db.collection('rides')
    // remove all data
    await Promise.all([
        colDrivers.remove({}),
        colRiders.remove({}),
        colRides.remove({}),
    ])
    // load all data
    await Promise.all([
        colDrivers.insertMany([
            {
                "name": "Driver 1",
                "location": "A",
                "car": "Innova"
            },
            {
                "name": "Driver 2",
                "location": "B",
                "car": "Innova"
            }]),
        colRiders.insertMany([
            {
                "username": "test1",
                "password": "test1",
                "name": "Test User 1",
                "location": "A"
            },
            {
                "username": "test2",
                "password": "test2",
                "name": "Test User 2",
                "location": "B"
            }
        ])
    ])
    return true;
}

run()
    .then(() => {
        console.log("Successful")
        process.exit();
    })
    .catch(console.error)
