const express = require("express");
const z = require("zod"); // first define the schema using zod (schema = z.string()) and then called the safeParse on schema.safeParse(variableName)
const app = express();

// Before the request goes to the route-handler there should be some pre-checks / validation on the request that is send from the client. The pre-checks in case of networking application (http servers) are input-validation (did the user sends the right inputs in body / headers), authencation (whether you can access the route-handler functionalities)

// These prechecks are performed using Middlewares (are functions that are executed before hitting the actual route-handler so that only valid users can access the logic present inside the route-handler)

// The syntax to call a middle-ware for each request is "app.use(function that you want to call)", if we want the middle-ware to be get called for every route-handler then do not mention the route with it then it will be matched with the every request coming to server

// if want to call middleware for specific route-handler then specify them in their route-handler before the actual logic kicks-in

// The route-handler callback function, middlewares both have access to req, res, next (this is other function) that is used to transfer the call to the next middleware / callback function in express

app.use(express.json());

app.post("/health-checkup", function(req, res) {
    // doing input-validation using zod
    const schema = z.array(z.number()); // an array of number is the schema is defined
    const kidneys = req.body; // we expect req.body to be any array of numbers
    const finalData = schema.safeParse(kidneys);

    console.log(finalData);

    res.status(200).send("Total kidenys ");
})


app.listen(3000);

// The client can send data either using query-params (specified in the routes), body , headers(json form), header, query-params are already defined in the request / req, but for the body we have to parse it
// The body can be text, json, html etc and the app.use(express.json()) middlewares -> can only handle the conversion of JSON data coming in the body into JS object for other it will give errors

// Global-catches -> middleware that will be implemented at the end so that if no route-handler is called or there is error with some route handler then that will be called we can achieve this with no route found and err

app.use(function(err, req, res, next) {
    // if the the case of no route-handler matching then the error will be false and if there is error with some route-handler error will be true and hence we cannot send server error to user
    if(err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        })
        return
    }
    // next is present because there can be more than 1 error handling middleware

    res.status(404).send("Route not found")
}); 

// Doing input validations using zod so that the main logic will only run if the user inputs are correct


// next is function that express provides and that function is calling the next middleware with the req, res. it not mapped with our next middleware