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
    if(isExistingAccount(username)){
        return res.status(409).json({ message: "Username or password already exists"});
    }

    // Here you would normally hash the password and save the user to DB
    // saveUser(username, hashedPassword);
    
    const payload = { username: username };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    req.session.authenticated = { accessToken: token };
    return res.json({ message: "User registered successfully", token: token });
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

const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));


// Note:
/**
 * You should add the jwt.sign(payload, jwtSecret, options) code when a user successfully logs in—typically inside your login route handler
 * This is where you create and sign a JWT token for the authenticated user and save it in the session.

For example, in your auth_users.js router (or wherever you handle login), after verifying the username and password, you would:

Create a payload with user info (e.g., username).
Sign the JWT with your secret key.
Save the token in the session.
Send a response back to the client.
Here is a simplified example inside a login route:

app.post('/customer/login', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password (your own logic here)
    if (validUser(username, password)) {
        const payload = { username: username };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // token valid for 1 hour

        // Save token in session
        req.session.authenticated = { accessToken: token };

        return res.json({ message: "User logged in successfully", token: token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});


This way, when the user makes requests to /customer/auth/*, your middleware verifies the token stored in the session.

If you want, I can help you write the complete login route or review your existing code for this part.

Would you like me to do that?

For more information, see the lab content section Update and test the authenticated user routes in auth_users.js.
 */