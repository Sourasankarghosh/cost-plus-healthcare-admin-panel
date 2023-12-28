// import our dependencies
const Express = require('express');
const dotenv = require('dotenv');
const flash = require('express-flash'),
session = require('express-session');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

// load environment variables
dotenv.config();

// configure our application
const app = new Express();
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());


// set sessions ,flash and fileupload
app.use(session({
    key:process.env.KEY,
    secret:process.env.SECRET,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: new Date(Date.now() + 3600000),
        maxAge: 3600000 
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies[process.env.KEY] && !req.session.authId) {
        res.clearCookie(process.env.KEY);        
    }
    next();
});

app.use(flash());
app.use(fileUpload());

// set ejs as our templating engine
app.set('view engine','ejs');

// tell express where to look for static assets and storage
app.use(Express.static(__dirname+'/assets'));
app.use(Express.static(__dirname+'/storage'))

// set the routes
require('./route/index')(app);


// start our server
const port = process.env.PORT|8080
app.listen(port,()=>{
    console.log(`server ${port} running successfully!`);
})