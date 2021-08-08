
const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql')
const uuid = require('uuid').v1

/**
 * Init objects 
 *
 * @param {*} e
 */
module.exports.init = (e) => {
    const { Rider, Rides } = require('./objects')(e);
    e.graph = {};
    //create query
    e.graph.query = new GraphQLObjectType({
        name: 'Query',
        description: 'Root Query',
        fields: () => ({
            me: {
                type: Rider,
                description: 'Rider details',

                args: {},
                /**
                 * Get data based on paramters
                 *
                 * @param {*} parent
                 * @param {*} args
                 * @param {*} context
                 * @return {*} 
                 */
                resolve: (parent, args, context) => {
                    return getRiderDetails(e, context?.user)
                }
            }
        })
    })
    //create mutation
    e.graph.mutation = new GraphQLObjectType({
        name: 'Mutation',
        description: 'Root Mutation',
        fields: () => ({
            ride: {
                type: Rides,
                description: 'Book a ride',
                args: {
                    location: { type: GraphQLNonNull(GraphQLString) }
                },
                /**
                 *
                 * Get data based on parameters
                 * @param {*} parent
                 * @param {*} args
                 * @param {*} context
                 * @return {*} 
                 */
                resolve: (parent, args, context) => {
                    // get rider details
                    return getRiderDetails(e, context?.user)
                        .then(user => {
                            // check if in same location
                            if (user.location === args.location)
                                return Promise.reject("Already at location");
                            // check if in pursuit
                            if (user.location === "InPursuit")
                                return Promise.reject("Already in pursuit");
                            //get if any drivers in location
                            return getDriverDetails(e, user.location)
                                .then(driver => {
                                    if (!driver)
                                        return Promise.reject("No driver found near your location");
                                    const rideId = uuid();
                                    //update location for all rider or drivers
                                    return updateLocation(e, user.id, driver.id, args.location, rideId)
                                        //update ride    
                                        .then(result => updateRideInfo(e, user.id, driver.id, user.location, args.location, rideId)
                                            .then(res => {
                                                //return ride details
                                                return getRideDetails(e, res?._doc?._id)
                                            }))
                                })
                        })
                }
            }
        })
    })
}

/**
 *
 * Gets riders details
 * @param {*} e
 * @param {*} user
 * @return {*} 
 */
function getRiderDetails(e, user) {
    return e.adapter.get('User').findOne({
        username: user?.username
    })
        .exec()
}

/**
 * Gets drivers details
 *
 * @param {*} e
 * @param {*} location
 * @return {*} 
 */
function getDriverDetails(e, location) {
    return e.adapter.get('Driver').findOne({
        location
    })
        .exec()
}

/**
 * Updates location for drivers, riders and updates state of ride
 *
 * @param {*} e
 * @param {*} rider
 * @param {*} driver
 * @param {*} toLocation
 * @param {*} rideId
 * @return {*} 
 */
function updateLocation(e, rider, driver, toLocation, rideId) {
    return Promise.all([
        e.adapter.get('Driver').update({
            _id: driver
        }, {
            location: "InPursuit"
        }),
        e.adapter.get('User').update({
            _id: rider
        }, {
            location: "InPursuit"
        })
    ])
        .then(() => {
            setTimeout(async () => {
                await Promise.all([
                    e.adapter.get('Driver').update({
                        _id: driver
                    }, {
                        location: toLocation
                    }),
                    e.adapter.get('User').update({
                        _id: rider
                    }, {
                        location: toLocation
                    }),
                    e.adapter.get('Ride').update({
                        id: rideId
                    }, {
                        state: "Completed"
                    })])
            }, 15000)
            return Promise.resolve(true)
        })
}

/**
 *
 * Get ride details
 * @param {*} e
 * @param {*} _id
 * @return {*} 
 */
function getRideDetails(e, _id) {
    return e.adapter.get('Ride').findOne({
        _id
    })
        .populate('driver')
        .populate('rider')
        .exec()
}

/**
 *
 * Update ride info
 * @param {*} e
 * @param {*} user
 * @param {*} driver
 * @param {*} from
 * @param {*} to
 * @param {*} id
 * @return {*} 
 */
function updateRideInfo(e, user, driver, from, to, id) {

    return e.adapter.get('Ride').create({
        date: new Date(),
        driver: driver,
        rider: user,
        fromLocation: from,
        toLocation: to,
        id,
        state: "InPursuit"
    })
}
