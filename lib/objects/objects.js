const { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt } = require('graphql')
const { GraphQLDateTime } = require('graphql-iso-date');

/**
 *
 * Get basic graphql objects
 * @param {*} e
 * @return {*} 
 */
module.exports = (e) => {
    const Driver = new GraphQLObjectType({
        name: 'Driver',
        description: 'This represents a driver in the company',
        fields: () => ({
            id: { type: GraphQLNonNull(GraphQLString) },
            name: { type: GraphQLNonNull(GraphQLString) },
            location: { type: GraphQLNonNull(GraphQLString) },
            gender: { type: GraphQLNonNull(GraphQLString) },
            rides: {
                type: new GraphQLList(Rides),
                args: {
                    page: {
                        description: "Page number, for paging. By default is 1",
                        defaultValue: 1,
                        type: GraphQLInt
                    }
                },
                /**
                 *
                 *
                 * @param {*} driver
                 * @param {*} args
                 * @param {*} context
                 * @return {*} 
                 */
                resolve: (driver, args, context) => {
                    return getRideDetails(e, {
                        driver: driver.id
                    }, args.page || 1)
                }
            }
        })
    })

    const Rider = new GraphQLObjectType({
        name: 'Rider',
        description: 'This represents a rider registered with the company',
        fields: () => ({
            id: { type: GraphQLNonNull(GraphQLString) },
            name: { type: GraphQLNonNull(GraphQLString) },
            username: { type: GraphQLNonNull(GraphQLString) },
            location: { type: GraphQLNonNull(GraphQLString) },
            gender: { type: GraphQLNonNull(GraphQLString) },
            rides: {
                type: new GraphQLList(Rides),
                args: {
                    page: {
                        description: "Page number, for paging. By default is 1",
                        defaultValue: 1,
                        type: GraphQLInt
                    }
                },
                /**
                 *
                 *
                 * @param {*} rider
                 * @param {*} args
                 * @param {*} context
                 * @return {*} 
                 */
                resolve: (rider, args, context) => {
                    return getRideDetails(e, {
                        rider: rider.id
                    }, args.page || 1)
                }
            }
        })
    })

    const Rides = new GraphQLObjectType({
        name: 'Rides',
        description: 'This a ride between a customer and a drive',
        fields: () => ({
            date: { type: GraphQLDateTime },
            state: { type: GraphQLNonNull(GraphQLString) },
            fromLocation: { type: GraphQLNonNull(GraphQLString) },
            toLocation: { type: GraphQLNonNull(GraphQLString) },
            rider: {
                type: Rider,
                /**
                 *
                 *
                 * @param {*} ride
                 * @return {*} 
                 */
                resolve: (ride) => {
                    return ride.rider
                }
            },
            driver: {
                type: Driver,
                /**
                 *
                 *
                 * @param {*} ride
                 * @return {*} 
                 */
                resolve: (ride) => {
                    return ride.driver
                }
            }
        })
    })

    return { Rider, Driver, Rides }
}


/**
 * Get ride details for where clause
 *
 * @param {*} e
 * @param {*} where
 * @param {*} page
 * @return {*} 
 */
function getRideDetails(e, where, page) {
    if (page <= 0)
        page = 1
    return e.adapter.get('Ride')
        .find(where)
        .sort({ date: -1 })
        .skip(5 * (page - 1))
        .limit(5)
        .populate('driver')
        .populate('rider')
        .exec()
}