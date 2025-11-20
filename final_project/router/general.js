const express = require('express');
let books = require("./booksdb.js");
let {isExistingAccount} = require("./auth_users.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

// --- TASK 10 --- PROMISE
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    retrieveBookList()
    .then(books => res.json(books))
    .catch(err => res.status(500).json({error: err.message}));
});

function retrieveBookList(){
    return new Promise((resolve, reject) =>  {
        resolve(books);
    })
}

// --- TASK 11 --- ASYNC-AWAIT
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res)=> {
    try{
        const bookDetails = getBookDetails(req.params.isbn);
        if(!bookDetails){
            return res.status(404).json({error: "This book does not have any details."});
        }
        res.json(bookDetails);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
 });
  
async function getBookDetails(isbn){
    return books[isbn];
}

// --- TASK 12 --- PROMISE
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    getBooksByAuthor(req.params.author)
        .then(booksByAuthor => { // whatever is returned by getBooksByAuthor is put as the param here, which is booksByAuthor;         // Note that .then is a callback that happens AFTER the promise resolves

            if(booksByAuthor.length > 0){
                res.json(booksByAuthor);
            }
            else{
                res.status(404).json({message: "No books are found under this author"});
            }
        })
        .catch(err => {
            res.status(500).json({error: err.message});
        })
});

function getBooksByAuthor(author){
    return new Promise((resolve, reject) => { // Promise executor callback, runs immediately
        try{
            const thisAuthor = author.toLowerCase();
            const booksByAuthor = [];
            //iterate through books list
            Object.keys(books).forEach((key) => {
                console.log(`Checking author: ${books[key].author}`); // debug
                if (books[key].author.toLowerCase() === author) {
                  booksByAuthor.push(books[key]);
                }
            });

            resolve(booksByAuthor);
        }
        catch(err){
            reject(err);
        }
    })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = [];

    Object.keys(books).forEach((value) => {
        console.log(`Checking title: ${books[value].title}`); // debug
        if (books[value].title.toLowerCase() === title) {
        booksByTitle.push(books[value]);
        }
    });

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]){
        res.json(books[isbn].reviews);
    }
    else{
        res.status(404).json({message: "No book found under this ISBN."});
    }
});

module.exports.general = public_users;
