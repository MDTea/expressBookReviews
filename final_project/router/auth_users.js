const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username: "user1", password: "pass1"},
    {username: "user2", password: "pass2"}
];

// let reviews = [
//     {username: "user1", review: "This book is a five out of five stars!"},
// ];

const isExistingAccount = (username, password)=>{ //returns boolean
    return ((users.some(user => user.username === username)) && (users.some(user=> user.password === password)));
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

const saveUser = (username, password) => {
    let message = "";
    try{
        users.push({"username": username, "password": password});
        message = "User successfully saved";
    }catch(err){
        message = "User failed to save : ";;
        return (message + err);
    }
}

// register
regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(400).json({message: "Log in information is missing"});
    }
    if(isExistingAccount(username, password)){
        return res.json({message: "This user already exists."});
    }
    else if(!isExistingAccount(username, password)){
        const resultMsg = saveUser(username, password);
        return res.json({message: resultMsg});
    }
    else{
        return res.status(401).json({message: "User is not logged in successfully."});
    }
});

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(400).json({message: "Log in information is missing"});
    }
    if(authenticatedUser(username, password)){
        return res.json({message: "User successfully logged in!"});
    }
    else{
        return res.status(401).json({message: "User is not logged in successfully."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //You have to give a review as a request query & it must get posted with the username (stored in the session) posted. 
    //If the same user posts a different review on the same ISBN, it should modify the existing review. 
    //If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
    // Verify the web token first
    let token = req.session.authenticated['accessToken'];
    jwt.verify(token, "access", (err, user) => {
        if(!err){
            req.user = user;
            next(); // Proceed to next middleware
        }
        else{
            return res.status(403).json({ message: "User not authenticated"});
        }
    });

    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isExistingAccount = isExistingAccount;
module.exports.users = users;
