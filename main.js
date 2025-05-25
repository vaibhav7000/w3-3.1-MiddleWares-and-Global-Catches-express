const express = require("express");
const app = express();

// Before the request goes to the route-handler there should be some pre-checks / validation on the request that is send from the client. The pre-checks in case of networking application (http servers) are input-validation (did the user sends the right inputs in body / headers), authencation (whether you can access the route-handler functionalities)

// These prechecks are performed using Middlewares (are functions that are executed before hitting the actual route-handler so that only valid users can access the logic present inside the route-handler)

// The syntax to call a middle-ware for each request is "app.use(function that you want to call)", if we want the middle-ware to be get called for every route-handler then do not mention the route with it then it will be matched with the every request coming to server

// if want to call middleware for specific route-handler then specify them in their route-handler before the actual logic kicks-in

// The route-handler callback function, middlewares both have access to req, res, next (this is other function) that is used to transfer the call to the next middleware / callback function in express




app.listen(3000);

// The client can send data either using query-params, body (json form), headers(json form)