// implementing middlewares 
const express = require("express");
const app = express();
let requestCount = 0;
let totalTime = 0;
// Middlewares (functions) are used to do some pre-checks before the request hits the route-handler, these pre-checks are user-input validation (whether the user send the right inputs in query-params, body, headers), authentication (whether this is valid user / authenticated user)

// if we want the middleware to be called for every-route than we define it using app.use() without any route, and hence it matches with every request that comes to server, else will declare the middlewares in the route-handler before the actual logic of that route-handler

// There is a special middleware called global catches that we define at the end of all the route-handler with 4 parameters, err, req, res, next. this is used if there will be some error in the route-handler method (in this case err will be truthy), or will be used when there will be no route matching (in this case err will be false, but no route has been hit 404), 
// these are defined so that client does not get the default error of the express

function totalRequest(req, res, next) {
    requestCount++;
    next();
}

app.use(totalRequest); // this we have defined in app.use because we will be called for every reqeust

app.use(function(req, res, next) {
    const beforeTime = Date.now(); // static property that returns number of milliseconds that are parsed from 1 jan 1970

    // attaching eventlistner to the res will be called when the response will be send from the server
    res.on("finish", function() {
        const afterTime = Date.now();
        let diff = afterTime - beforeTime; // milliseconds
        diff /= 1000;

        totalTime += diff;

        console.log("average time take by the server is " + (totalTime / requestCount));
    })

    next();
})

app.get("/", function(req, res) {
    setTimeout(function() {
        res.status(200).send("Welcome to the http server")
    }, 3000)
})

// calculate the average time the server is taking to response to the request



app.listen(3000)