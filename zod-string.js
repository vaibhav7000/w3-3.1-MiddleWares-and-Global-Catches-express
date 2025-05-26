const z = require("zod");
const express = require("express");
const app = express();
const port = 3000;
// zod with strings validations, first zod will check it is valid string and then checks other values min, max, length
// 1. z.string().max(5)
// 2. z.string().min(5)
// 3. z.string().length()
// 4. z.string().startsWith("aaa");
// 5. z.string().endsWith("zzz");
// 6. z.string().includes("---") -> the string should include this string as substring (continous part of the string) 
// 7. z.string(value).uppercase(); z.string(value).lowercase();, z.string(value).trim() -> these are zod transformation methods on the string if passes the test

// 8. z.string().regex(/^[a-z]+$/); -> checks if the given input is string and then checks it should only contains lowercase letter (atleast 1 else will throw error / success false)

// z.email() -> true if the string is valid email


// JS provides creation of the Date object with the ISO string (implemented by all browsers)
// ISO string format 1. "yyyy-mm", "yyyy" (date format), datetime format -> by default represented in utc as "YYYY-MM-DDTHH:MM:SSZ" 


// Z-> represent UTC / or +00:00 
// UTC and GMT time are same


// when we print the date object in JS it will always throws the time according to the UTC time, but using the get methods throws the local time

const minLength = z.string().min(5);
const maxLength = z.string().max(10);
const length = z.string().length(7);
const startsWith = z.string().startsWith("va");
const endsWith = z.string().endsWith("av");
const includes = z.string().includes("bh");

app.use(express.json()); // middleware that only expects valid json in the body else through error

function userValidation(req, res, next) {
    const userName = req.body.userName;

    let result = minLength.safeParse(userName);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
        })
        return
    }

    result = maxLength.safeParse(userName);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
        })
        return
    }

    result = length.safeParse(userName);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues
        })
        return;
    }

    // using parse method
    try {
        result = startsWith.parse(userName);
    } catch(err) {
        // this following line will be obious
        if(err instanceof z.ZodError) {
            res.status(411).json({
                issues: err.issues,
            })
        }
        return
    }

    try {
        result = endsWith.parse(userName);
    } catch(error) {
        // this will be obious because there is only 1 line that can throw the error
        if(error instanceof z.ZodError) {
            res.status(411).json({
                issues: error.issues
            })
        }
        return;
    }

    result = includes.safeParse(userName);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues
        })
        return
    }

    // tranforming the string if string using zod
    const uppercaseSchema = z.string().toUpperCase(); // similarly we can use toLowerCase and trim operation

    result = uppercaseSchema.safeParse(userName);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues
        })
        return
    }

    console.log("ALL string checks are done " + result.data);

    next();
}

app.use(userValidation);


app.get("/user", function(req, res) {
    res.status(200).send("welcome to the http server")
})

// isoDateTime validation using zod
// iso is the international standard for representation of date and time. it has different format to represents the date and time and according to these formats JS has implemented it functionality
// iso string by default represents UTC time / Z /GMT, but we can change that when providing the string
// format 1. -> "YYYY-MM-DD", "YYYY-MM", "YYYY" (only date)
// format 2. "YYYY-MM-DDTHH:MM:SSZ", "YYYY-MM-DDTHH:MM:SS+- set the time according to the time-zone"

const isoDateAsUTCOnly = z.iso.datetime();
const isoDateStringAnyTimeZone = z.iso.datetime({
    offset: true
})

// iso date format (YYYY-MM-DD / YYYY / YYYY-MM)
const normalIsoDateFormat = z.iso.date();

// iso time (HH:MM:SS, HH -> 0 to 23, MM -> 0 to 59, SS -> 0 to 59)
const isoTimeFormat = z.iso.time();




app.get("/isoDateTimeUTCOnly", function(req, res) {
    const date = req.body.date;

    const result = isoDateAsUTCOnly.safeParse(date);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
        })
        return
    }

    const newDate = new Date(date);

    console.log(newDate);

    req.status(200).json({
        newDate
    })
})

app.get("/isoDateTimeAnyTime", function(req, res) {

})

app.get("/normalIsoDateFormat", function(req, res) {

})

app.get("/isoTimeFormat", function(req, res) {

})

app.listen(port);

// in JS
// Date.parse() is a static method that accepts a valid date string (ISO format) and returns the number of milliseconds from 1 jan 1970