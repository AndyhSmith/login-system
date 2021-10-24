var express = require("express");
var mysql = require('mysql');
const cors = require('cors');

var crypto = require('crypto')


var app = express();
app.use(cors())


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Smart9boy!",
    database: "goals"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});





app.get("/login/:username/:password", (req, res, next) => {
    let username = req.params.username;
    let password = req.params.password;
    // connect to your database
    
    let theResult = ""
    con.query("SELECT * FROM Users WHERE (Username = '" + username + "') or (Email = '" + username + "') AND PasswordHashed = '" + password + "';", function (err, result) {
      if (err) {
        theResult = result
        console.log(err);
        res.status(401)
        res.send("Invalid Username or Password.")
      } else {
        var shasum = crypto.createHash('sha1')
        shasum.update(Math.random().toString())
        shasum = shasum.digest('hex') // => "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"
        console.log(result)
        con.query(`INSERT INTO Token (UserName, Token, ValidUntil) VALUES ('${result[0].UserName}','${shasum}', '2021-10-25');`, function (err, result) {
          if (err) throw err;
        });
        res.status(200);
        res.send({"Token":shasum, "result":result[0]});
      }
    });
});

app.get("/logout/:username/:token",  (req, res, next) => {
  console.log("Trying To Log Out")
  let username = req.params.username.toLowerCase();
  let token = req.params.token;
  con.query("DELETE FROM Token where username = '" + username + "'", function (err, result) {
    if (err) throw err;
  });
});

app.get("/checkuser/:username",  (req, res, next) => {
  console.log("Trying To Find User")
  let username = req.params.username.toLowerCase();
  con.query("SELECT UserName, FirstName, LastName FROM Users where '" + username + "' = Left(UserName, " + username.length + ") or '" + username + "' = Left(FirstName, " + username.length + ") or '" + username + "' = Left(LastName, " + username.length + ");", function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/register/:username/:password/:FirstName/:LastName/:Email", (req, res, next) => {
  console.log("User Trying to Register")
  let username = req.params.username.toLowerCase();
  let password = req.params.password;
  let firstName = req.params.FirstName;
  let lastName = req.params.LastName;
  let email = req.params.Email
  // connect to your database
  
 
  con.query(`select count(*) from Users where username = '${username}';`, function (err, result) {
    if (err) throw err;
    // console.log(result[0]["count(*)"]).
    let count = parseInt(result[0]["count(*)"])
    if (count == 0) {
      con.query("INSERT INTO Users (UserName, FirstName, LastName, PasswordHashed, Email, Points, DateJoined) \
        VALUES ('" + username + "', '" + firstName + "', '" + lastName + "', '" + password + "', '" + email + "',10 , '2021-10-22');", function (err, result) {
        if (err) throw err;
        res.json(result);
      });
    } else {
      res.send({message:"Username Already Taken"})
    }
  });
});


app.get("/username/:username", (req, res, next) => {
  let username = req.params.username.toLowerCase();
  con.query(`select count(*) from Users where username = '${username}';`, function (err, result) {
    if (err) throw err;
    let count = parseInt(result[0]["count(*)"])
    if (count == 0) {
      res.status(200)
      res.send()
    } else {
      res.status(404)
      res.send()
    }
  });
});

app.get("/", (req, res, next) => {
    res.json("Please choose a proper end point.");
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});