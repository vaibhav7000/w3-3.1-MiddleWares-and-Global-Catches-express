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

// app.use(userValidation); // Now I want this to be happend for only user route => adding in user


app.get("/user", userValidation, function(req, res) {
    res.status(200).send("welcome to the http server")
})

// isoDateTime validation using zod these are present with string schemes because iso format is represented in string format
// iso is the international standard for representation of date and time. it has different format to represents the date and time and according to these formats zod has implemented it functionality
// iso string by default represents UTC time / Z /GMT, but we can change that when providing the string
// format 1. -> "YYYY-MM-DD", "YYYY-MM", "YYYY" (only date)
// format 2. "YYYY-MM-DDTHH:MM:SSZ", "YYYY-MM-DDTHH:MM:SS+- set the time according to the time-zone"

const isoDateAsUTCOnly = z.string().datetime(); // only accepts string in the form of format 2 with UTC time
const isoDateStringAnyTimeZone = z.string().datetime({
    offset: true, // now we can provide other time zone instead of UTC like "YYYY-MM-DDTHH:MM:SS=05:30" -> indian time and it will accept
    precision: 3, // using this we can set the number of digits that we can pass in microseconds after SS if not send zod will throw error because it requires these digits 
})

// iso String with precision -> "YYYY-MM-DDTHH:MM:SS.1234Z" -> 1234 -> represent precision


// iso date format (YYYY-MM-DD / YYYY / YYYY-MM)
const normalIsoDateFormat = z.string().date() // only accepts format 1 (YYYY-MM-DD) other are to iso format but accepts this only

// iso time (HH:MM:SS, HH -> 0 to 23, MM -> 0 to 59, SS -> 0 to 59)
const isoTimeFormat = z.string().time() // same precision can be applied but no timeszones / no offsets




app.get("/isoDateTimeUTCOnly", function(req, res) {
    const date = req.body.date;

    const result = isoDateAsUTCOnly.safeParse(date);

    if(!result.success) {
        console.log(date)
        res.status(411).json({
            issues: result.error.issues,
        })
        return
    }

    const newDate = new Date(date); // making a date object from the ISO verfied string in UTC but will pick the system's time / local time by converting the UTC time into our time

    console.log(newDate.getHours());
    console.log(newDate.getMonth());
    console.log(newDate);

    res.status(200).json({
        newDate
    })
})

app.get("/isoDateTimeAnyTimeZone", function(req, res) {
    const date = req.body.date;

    const result = isoDateStringAnyTimeZone.safeParse(date);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
            name: result.name
        })

        return
    }

    // converting the given isoDate string with any timezone into the local time according to our-time zone
    const newDate = new Date(date);

    console.log(newDate);

    res.status(200).json({
        newDate
    })
})

app.get("/normalIsoDateFormat", function(req, res) {
    const date = req.body.date;

    // using parse method -> "YYYY-MM-DD"
    try {
        const result = normalIsoDateFormat.parse(date);

        const newDate = new Date(result); // print utc time, but get properties provides value according to our time zone

        res.status(200).json({
            newDate
        })
    } catch(err) {
        if(err instanceof z.ZodError) {
            res.status(411).json({
                issues: err.issues,
                name: err.name
            })
            return
        }
    }
})

app.get("/isoTimeFormat", function(req, res) {
    // this is only used to check the time format, we cannot create date using isoTimeFormat
    const time = req.body.date;

    try {
        // if pass we will directly get the date
        const result = isoTimeFormat.parse(time);

        console.log(result);

        res.status(200).json({
            result
        })
    } catch(err) {
        if(err instanceof z.ZodError) {
            res.status(411).json({
                issues: err.issues,
                name: err.name
            })
            return
        }
    }
})

// global catches -> middleware to handle the error of the sever so the the client does not able to see because by default express sends the error directly to client

app.use(function(err, req, res, next) {
    if(err) {
        console.log(err);
        res.status(500).send("Internal server error")
        return
    }
})

app.listen(port);

// in JS
// Date.parse() is a static method that accepts a valid date string (ISO format) and returns the number of milliseconds from 1 jan 1970

// JS date internal working for month is according to 0-based format but we have to provide it the correct month.

// JS date always returns the date as UTC string but the internal values are according to the your timezone / system timezone