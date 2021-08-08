const MongoClient = require('mongodb').MongoClient

async function run() {
    const url = process?.env?.MONGO || 'mongodb://localhost:27017'
    const dbName = process?.env?.DB || 'cab-booker'
    const client = new MongoClient(url)

    await client.connect()
    console.log('Connected to server')

    const db = client.db(dbName)

    const colDrivers = db.collection('drivers')
    const colRiders = db.collection('riders')
    const colRides = db.collection('rides')
    await Promise.all([
        colDrivers.remove({}),
        colRiders.remove({}),
        colRides.remove({}),
    ])
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

module.exports = run
