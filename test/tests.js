const assert = require('assert');
const stub = require('./stubs/server_stub')
const loadScript = require('./stubs/load_stub');
const supertest = require('supertest');

let mongo = null;
let e = null;
let request = null;

before(function (done) {
    //silence all logs
    console.log = function () { };
    console.warn = function () { };
    console.error = function () { };
    console.debug = function () { };
    // init all stubs
    stub()
        .then(({ engine, mongod, uri }) => {
            loadScript()
                .then(() => {
                    mongo = mongod;
                    e = engine;
                    request = supertest(e.app)
                    done();
                })
                .catch(done)
        })
        .catch(done)
})

after(function (done) {
    console.log("Done")
    done()
});

describe(`Booking Cabs (Takes around ~20 seconds)`, function () {

    it('Book cab for test user 1', function (done) {
        let query = 'mutation{ride(location:"B"){rider{name}}}'
        request.get(`/graphql?username=test1&password=test1&query=${query}`)
            .expect(200)
            .end(function (err, res) {
                if (res.body instanceof Object && !res.body.errors) {
                    done();
                }
                else
                    done("Invalid Response");
            });
    })
    it('Book cab for test user 1 when already in pursuit, should fail', function (done) {
        let query = 'mutation{ride(location:"B"){rider{name}}}'
        request.get(`/graphql?username=test1&password=test1&query=${query}`)
            .expect(200)
            .end(function (err, res) {
                if (res.body instanceof Object && res.body.errors) {
                    done();
                }
                else
                    done("Invalid Response, should have failed");
            });
    })
    it('Book cab for test user 1 when already in same location, should fail', function (done) {
        setTimeout(() => {
            let query = 'mutation{ride(location:"B"){rider{name}}}'
            request.get(`/graphql?username=test1&password=test1&query=${query}`)
                .expect(200)
                .end(function (err, res) {
                    if (res.body instanceof Object && res.body.errors) {
                        done();
                    }
                    else
                        done("Invalid Response, should have failed");
                });
        }, 16000)

    })
})

describe(`Past rides`, function () {

    it('Getting past rides for test user 1', function (done) {
        let query = '{me{rides{date,driver{name}}}}'
        request.get(`/graphql?username=test1&password=test1&query=${query}`)
            .expect(200)
            .end(function (err, res) {
                if (res.body instanceof Object && res?.body?.data?.me?.rides && res?.body?.data?.me?.rides.length === 1) {
                    done();
                }
                else
                    done("Invalid Response");
            });
    })
})