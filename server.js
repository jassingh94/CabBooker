const e = require('./lib/engine')
require('dotenv').config()

// initialize & start engine
e
    .init()
    .start();