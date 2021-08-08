# CabBooker
Cab booker uses the power of graphql to enable a interactive UI for cab booking

## System Requirements 
- Node.js version : `v14`
- MongoDB version : `4.0`

- Note - **Will break unexpectedly due to use of Optional Chaining, If using Nodejs version 12 or below**

## Modules user 
- express
- graphql
- mongoose
- mongodb-memory-server
- istanbul
- mocha
- jsonwebtoken


Contents : 
- [Setting up the project](#getting-started)
- [Brief working](#working)
- [Interating with the service](#using-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)

## Getting Started 

> Clone the project 


```javascript 
git clone https://github.com/jassingh94/CabBooker.git
```

> Install dependencies , open clone project in command prompt and run command 

```javascript
npm i
```

> Run Mongodb 

- Install mongodb on System and run 

> Change mongodb host in `.env` if required

- By default is 

```javascript 
MONGO=mongodb://localhost:27017/
```
> Load data in db 

- Run Command : 

```javascript
node resetAndLoadScript
```

> All set! Start server 

- Run Command : 

```javascript 
npm start
```

----

## Using the application

> Logging into the application 

Open URL in browser : 

```javascript
http://localhost:3030/login?username=test1&password=test1
```
- This logins in the user
- Sets session for browser window

                                     OR

Open URL in browser, directly access Graphql UI : 

```javascript
http://localhost:3030/?username=test1&password=test1
```

> Booking a cab 

- Lets book a cab for user `test1`
- user `test1` is by default at location `A`
- Navigate to `http://localhost:3030/?username=test1&password=test1`
- add the following query to Graphql Window 
```javascript
mutation{
  ride(location:"B"){
    driver{
      name,
      location
    }
  }
}
```
- And press play, this adds a request from user `test1` at location `A` to travel to location `B`.
- For the first `15seconds` the status once booked would be `In Pursuit` for both the drive and the user

> Check past rides for a user
- Lets check the past rides for user `test1` who is currently at location `B` if following above flow. 
- Navigate to `http://localhost:3030/?username=test1&password=test1`
- add the following query to Graphql Window 
```javascript
{
  me {
    name
    username
    rides {
      driver {
        name
        location
      }
      date
      fromLocation
      toLocation
    }
  }
}
```
- This query gets all the past rides for logged in user and, prints the ride info like : 
  - Date
  - Starting Location 
  - Ending Location 
  - Driver Info


> Logging out 
- Open following url in browser 
- `http://localhost:3030/logout`
- user session should be destroyed


----

## Working 

- The default scripts specified in the above steps: 
    - Adds two Users 
        - `test1`
        - `test2`
    - Adds two Drivers 
        - `Driver 1` 
        - `Driver 2`
- When booking a cab
   - The user specifies in the Graphql interface as paramter the destination location
   - If there are any drivers available in the starting location where the User currently is
        - Driver is assigned
        - else, `error` is thrown
    -  Once driver is assigned both the `Rider` and the `Drivers` location changes to `In pursuit` for 15 seconds
        - If the rider tries to book a while in pursuit, an `error` is thrown
    - If a `rider` is in the same location as the end location provided while booking a cab. `Error` is thrown
- Fetching past rides
    - The graphql interface can be used to fetch 5 past rides per page. 
    - If user wishes to view older pages, page paramter can be provided in the arguement. 
            - as such 

```javascript
{
  me {
    name
    username
    rides(page:2) {
      driver {
        name
        location
      }
      date
      fromLocation
      toLocation
    }
  }
}
```
- Graphql Documentation on the `UI` can be used to see what all options are available per class

----


## Testing 

- The service internally uses `Mocha` for performing test cases
- The service also hosts an `in-memory mongo instance`, for performing test cases 
- The service also uses `Istanbul` for test coverage
  - Last checked was `96.92%`
- Can run tests by running command `npm run test`
- Can run test coverage by running command `npm run coverage`


## Api Documentation

- Can be viewed at (https://editor.swagger.io/)
- Paste [JSON](https://github.com/jassingh94/CabBooker/resources/swagger.json) 


## Pictorial Representations 

> Adding a ride 

![image](https://user-images.githubusercontent.com/63552793/128639407-9b5b208a-5d4b-4df5-9aa8-21847c400759.png)


> Viewing past rides 

![image](https://user-images.githubusercontent.com/63552793/128639422-01e0ea40-5547-419f-aeeb-90c71b0d768a.png)


