const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const chalk = require('chalk');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const csrf = require('csurf');
const Auth0Strategy = require('passport-auth0');
const path = require('path');

const app = express();

let envPath = path.resolve(process.cwd(), '.production.env');

if (process.env.NODE_ENV === 'development')
    envPath = path.resolve(process.cwd(), '.local.env');

dotenv.config({ path: envPath });

// const csrfProtection = csrf();

// Passport config
// require("./config/passport")(passport);
// DB config
const db = require('./config/keys').MongoURI;

const authRoutes = require('./routes/authRoute');
const deliveryPlacesRoute = require('./routes/deliveryPlacesRoute');
const homeRoute = require('./routes/homeRoute');
const indexRoute = require('./routes/indexRoute');
const ordersRoute = require('./routes/ordersRoute');
const projectsRoute = require('./routes/projectsRoute');
const ticketsRoute = require('./routes/ticketsRoute');
const userRoute = require('./routes/userRoute');
const admin = require('./routes/adminRoute');
const sendOrder = require('./routes/sendOrder');
const User = require('./models/User');
const artNumber = require("./routes/artNumber")
const { getToken } = require('./config/Token');
const PORT = process.env.PORT || 3000;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(chalk.blue('MongoDB Connected...')))
    .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
// express cors 
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});



// Express Session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        cookie: {},
        // cookie: { secure: true }
    })
);

// Connect flash
app.use(flash());

// Method Override
app.use(methodOverride('_method'));

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// app.use(csrfProtection);
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });
const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTHO_DOMAIN,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */
        return done(null, profile);
    }
);
// Passport middleware --- location important
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
// Creating custom middleware with Express
app.use(async (req, res, next) => {
    if (req.user && !req.user?._id) {
        const test = await User.findOne({ email: req.user._json.email });
        req.user._id = test._id;
        req.user.email = test.email;
        req.user.token = await getToken(test._id);
    }
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Routes

// const userRoutes = require("./routes/user.js");
app.set('trust proxy', 1);
app.use(authRoutes);
app.use(deliveryPlacesRoute);
app.use(homeRoute);
app.use(indexRoute);
app.use(ordersRoute);
app.use(projectsRoute);
app.use(ticketsRoute);
app.use(userRoute);
app.use(admin);
app.use(sendOrder)
app.use(artNumber)
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route does not exist',
    });
});
// require model DevTicket

// app.use("/", userRoutes);

app.listen(PORT, (req, res, next) =>
    console.log(`App running on PORT:${chalk.green(`${PORT}`)}`)
);
