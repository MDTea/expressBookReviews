// Task 8: started
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const {isExistingAccount, users} = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const jwtSecret = "superSecr3t32939";

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    //Check if user is logged in and has the valid access token
    if(req.session && req.session.authenticated && req.session.authenticated.accessToken){
        let token = req.session.authenticated['accessToken'];
        // verify JWT
        jwt.verify(token, "access", (err, user) => {
            if(!err){
                req.user = user;
                next(); // Proceed to next middleware
            }
            else{
                return res.status(403).json({ message: "User not authenticated"});
            }
        });
    }
    else{
        return res.status(403).json({ message: "User is not logged in"});
    }
});

app.post('/customer/register', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password (your own logic here)
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password missing" });
    }
    if(isExistingAccount(username, password)){
        return res.status(409).json({ message: "Username or password already exists"});
    }
    else{
        const payload = { username: username };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        req.session.authenticated = { accessToken: token };
        users.push({"username": username, "password": password});
        return res.json({ message: "User registered successfully", token: token , users: users});
    }    
});

app.post('/customer/login', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password (your own logic here)
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password missing" });
    }

    if (isExistingAccount(username, password)) {
        const payload = { username: username };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        req.session.authenticated = { accessToken: token };
        return res.json({ message: "User logged in successfully", token: token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));