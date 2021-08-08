const { MongoMemoryServer } = require('mongodb-memory-server');


module.exports = async () => {

    // This will create an new instance of "MongoMemoryServer" and automatically start it
    const mongod = await MongoMemoryServer.create();

    const uri = mongod.getUri();

    return { mongod, uri };
}