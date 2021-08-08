const express = require('express')
const adapter = require('./adapter')
const graphInit = require('./objects/init')
const path = require('path')
const registerViews = require('../routes/register')


module.exports = {
    //adapter
    adapter: null,
    //express app
    app: null,
    //port app runs on
    port: null,
    //init app
    init: function (config = {}) {
        //init adapter
        this.adapter = new adapter(config);
        this.app = express()
        this.port = config.PORT || 3030
        //init graphql
        graphInit.init(this);
        return this;
    },
    //start app
    start: function (callback) {
        registerViews(this, this.app);
        this.app.listen(this.port, () => {
            console.log(`Booker listening at http://localhost:${this.port}`)
        })
        //register routes
        return this;
    }
}
