const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username: "user1", password: "pass1"},
    {username: "user2", password: "pass2"}
];

const isValid = (username, password)=>{ //returns boolean
//write code to check is the username is valid
    if((users.some(user => user.username === username)) && (users.some(user=> user.password === password))){
        return true;
    }
    else{
        return false;
    }
    // return !(users.some(user => user.username === username));
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
