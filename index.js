const express = require("express");
const mongoose = require('mongoose');
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require('./config/keys');
require('./models/User');
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

// fix for "TypeError: req.session.regenerate is not a function"
// https://stackoverflow.com/a/75195471/11532910
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
});

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
