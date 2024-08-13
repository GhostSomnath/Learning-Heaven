const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const compiler = require('compilex');
const cors = require('cors')
const options = { static: true };
compiler.init(options);
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const seedDB = require('./seed');

app.use(cors());

// Import Routes
const articleRouter = require('./routes/articleRoutes');
const User = require("./models/User");
const wishlistRoutes = require("./routes/wishlist");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const productApi = require("./routes/api/productapi");


// Database URL
const dbURL = "mongodb+srv://somnath21kaushik:somnath@learning-heaven.ucnxlzr.mongodb.net/";
mongoose.set("strictQuery", true);
mongoose.connect(dbURL)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));

// MongoDB Connection
// mongoose.connect('mongodb+srv://somnath:somnath@cluster0.5y9meom.mongodb.net/LearningHeaven', { family: 4 })
//     .then(() => console.log('Connected to DB'))
//     .catch((err) => console.log('error connecting ', err.message));



// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


// Serve Static Assets
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/codemirror-5.65.16', express.static(path.join(__dirname, 'codemirror-5.65.16')));
app.use('/Frontend', express.static(path.join(__dirname, 'Frontend')));
app.use('/Home', express.static(path.join(__dirname, 'Frontend', 'Home')));
app.use('/Components', express.static(path.join(__dirname, 'Frontend', 'Components')));
app.use('/Contact', express.static(path.join(__dirname, 'Frontend', 'Contact')));
app.use('/Resources', express.static(path.join(__dirname, 'Frontend', 'Resources')));
app.use('/Courses', express.static(path.join(__dirname, 'Frontend', 'Courses')));
// app.use('/Plans', express.static(path.join(__dirname, 'Frontend', 'Plans')));
app.use('/Resource_Pdfs', express.static(path.join(__dirname, 'Frontend', 'Resource_Pdfs')));
app.use('/Images', express.static(path.join(__dirname, 'Frontend', 'Images')));
app.use('/Placements', express.static(path.join(__dirname, 'Frontend', 'Placements')));
app.use('/Compiler', express.static(path.join(__dirname, 'Frontend', 'Compiler')));
app.use('/output.css', express.static(path.join(__dirname, 'Frontend', 'output.css')));
app.use('/tailwind.config.js', express.static(path.join(__dirname, 'tailwind.config.js')));

app.use("/layouts", express.static(path.join(__dirname, "Frontend", "layouts")));

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Frontend"));



// Session configuration
const secret = "weneedabettersecretkey";
const store = MongoStore.create({
    secret: secret,
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60
});

const sessionConfig = {
    store: store,
    name: "bhaukaal",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Global variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// seedDB();

// Routes
// const articleRouter = require('./routes/technews'); 
app.use('/technews', articleRouter);

// Route Handlers
app.get("/", (req, res) => {
    res.render("Home/index");
});

app.get("/contact", (req, res) => {
    res.render("Contact/Contact");
});

app.get("/resources", (req, res) => {
    res.render("Resources/Resources");
});

app.get("/compiler", function (req, res){
    compiler.flush(function () {
        console.log('deleted');
    });
    res.render("Compiler/Compiler");
});

// app.get("/plans", (req, res) => {
//     res.render("Plans/plans");
// });

app.get("/courses", (req, res) => {
    res.render("Courses/courses");
});

app.get("/placements", (req, res) => {
    res.render("Placements/Placements");
});

app.get("/user/cart/placed", (req, res) => {
    res.render("placed");
});


// Route handlers
app.use("/wishlist", wishlistRoutes);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(productApi);



// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Code Compilation Route
app.post("/compile", (req, res) => {
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;

    try {
        // Source: https://github.com/scriptnull/compilex

        if (lang === "Cpp") {
            var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile)
            if (!input) {
                compiler.compileCPP(envData, code, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang === "Java") {
            var envData = { OS: "windows" }; // (Support for Linux in Next version)
            if (!input) {
                compiler.compileJava(envData, code, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang === "Python") {
            var envData = { OS: "windows" }; // (Support for Linux in Next version)
            if (!input) {
                compiler.compilePython(envData, code, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        }
    } catch (err) {
        console.log("error");
    }

    // var envData = { OS: "windows" };
    // // else
    // // var envData = { OS: "linux" }; 
    // compiler.compilePython(envData, code, function (data) {    // it will make a temp file to execute the program.
    //     if (data.output) {
    //         res.send(data);
    //     } else {
    //         res.send({ output: "error" });
    //     }
    // });
});

// Start Server
app.listen(8000, () => {
    console.log("Server is running on http://127.0.0.1:8000");
});
