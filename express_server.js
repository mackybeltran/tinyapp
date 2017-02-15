var express = require("express"); //using the express module
var app = express();              //enabling express to be used as app.
const bodyParser = require("body-parser"); // middleware
const cookieParser = require('cookie-parser'); //middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs"); //middleware

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", // out initial database
  "9sm5xK": "http://www.google.com"
};

app.post("/urls/:id/delete", (req, res) => { //deleting urls from /url
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.get("/", (req, res) => { //what happens when you go to /
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => { //the contents of the database in json format
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {  //sample hello world at /hello
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {      // rendering /urls
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {  // rendering /new
  let templateVars = {username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let shortID = generateRandomString();
  urlDatabase[shortID] = req.body.longURL;
  console.log(urlDatabase);
  res.send("Ok");
});

app.get("/urls/:id", (req, res) => {            //renders urls/:id as defoned in urls_show
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/")
});

app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username)
  res.redirect("/")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
}
