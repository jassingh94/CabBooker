const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema, graphql } = require('graphql')

/**
 *
 *
 * @param {*} e
 * @param {*} app
 */
module.exports.register = (e, app) => {
    const schema = new GraphQLSchema({
        query: e?.graph?.query,
        mutation: e?.graph?.mutation
    })

    app.get('/graphql', (req, res) => {
        graphql(schema, req?.query?.query, null, { user: req.user, req })
            .then((response) => {
                return res.send(response)
            })
            .catch(err => {
                return res.status(500).send(err)
            })
    })

    app.use('/', graphqlHTTP((req, res) => ({
        schema: schema,
        graphiql: true,
        context: { user: req.user, req },
        customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split('\n') : [],
            path: error.path
        })
    })))
}