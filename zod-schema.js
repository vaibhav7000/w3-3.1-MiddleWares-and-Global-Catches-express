const express = require("express");
const z = require("zod");
const app = express();
const port = 3000;
const storage = [];

const userSchema = z.object({
    userName: z.literal("admin"),
    pass: z.literal("pass"),
})
// defining the schemas with differnt methods but at the end either use parse / safeParse on the schema object

// zod with primitives validation -> z.string(), z.number(), z.boolean(), z.undefined(), z.null()

// Coercion in zod "tries" to convert the given data into the valid scheme and then performs the checks on the data
// suppose the user send "42" -> valid number but in string if we do z.number("42") -> error, but if we use coercion z.coercion.number("42") -> will convert "42" -> 42 and hence does not provide error

// literal in zod -> literally providing the value that is mention while defining the schema z.literal("IN"), if the provided value is "IN" then only it will will be true. providing multiple values in the literal using array [all values].


// our backend application only contains 1 user whose name = admin and pass = pass => will be doing authencation using zod literals

function authencateUser(req, res, next) {
    // Node.js (and Express) automatically converts header keys to lowercase when receiving them.
    const userName = req.headers.username;
    const pass = req.headers.pass;
    console.log(userName);

    // we can directly send the user object in headers but then require to parse it in valid JSON format using JSON.parse()
    // sending individual key does not require any parsing because the header in js object which is converted to JSON format before sending (more convient)
    const finalObject = {
        userName,
        pass
    }

    console.log(finalObject);

    const result = userSchema.safeParse(finalObject);

    console.log(result);

    if(!result.success) {
        res.status(403).json({
            msg: "You does not belong to the user 😢",
        })
        return
    }

    next(); // will pass the js thread to the next middle-ware or final route-handler where the request route = route-handler route
}

app.use(authencateUser); // will be called for every-route which are present below it

app.get("/todos", function(req, res) {
    // already authenticated
    res.status(200).json(storage);
})

// gloabal-catches
app.use(function(err, req, res, next) {
    if(err) {
        res.status(500).send("something wrong with the server")
        return
    }
    next();
})

app.use(function(req, res, next) {
    res.status(404).json({
        msg: "Route does not exist 🫡"
    })
})

app.listen(port);