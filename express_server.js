var express = require("express"); //using the express module
var app = express();              //enabling express to be used as app.
const bodyParser = require("body-parser"); // middleware
const cookieParser = require('cookie-parser'); //middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs"); //middleware

let generateRandomString = () => { //random string generator
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
}

function urlsForUser(id) {
 const userURLs = {};
 for (shortURL in urlDatabase){
   if (id === urlDatabase[shortURL].userID){
     userURLs[shortURL] = urlDatabase[shortURL];
   }
 }
 return userURLs;
}

let urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca",
               userID: "userRandomID"
            },
  "9sm5xK": { longURL: "http://www.google.com",
               userID: "user2RandomID"
            }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID",
    email: "lincoln@dogs.com",
    password: "arfarf"
  }
}


app.post("/urls/:id/delete", (req, res) => { //deleting urls from /url
  delete urlDatabase[req.params.id].longURL;
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
  let templateVars = { urls: urlsForUser(req.cookies.tinyapp), user: users[req.cookies.tinyapp] };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {  // rendering /new
  let templateVars = {user: users[req.cookies.tinyapp]}
  if (typeof(req.cookies.tinyapp) !== 'undefined'){
    res.render("urls_new", templateVars)
  } else {res.redirect("/login")
}
});

app.post("/urls", (req, res) => {
  let shortID = generateRandomString();
  urlDatabase[shortID] = {longURL: req.body.longURL, userID: req.cookies.tinyapp};
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {            //renders urls/:id as defined in urls_show
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.tinyapp] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[shortURL].longURL
  res.redirect(longURL);
});

app.get("/register", (req,res) => {          //rendering the registration page
  res.render("urls_register");
});

app.get("/login", (req, res) => {
  res.render("urls_login")
})

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
});

app.post("/login", (req, res) => {

  for (let userID in users) {
    if (users[userID].email === req.body.email && users[userID].password === req.body.password){
      res.cookie('tinyapp', userID)
      return res.redirect("/")
    }
    }
  return res.status(403).send("thus username/password doesn't exist");

});

app.post("/logout", (req, res) => {
  res.clearCookie("tinyapp")
  res.redirect("/")
})

app.post("/register", (req, res) => {
    for (let k in users){
    if (users[k].email === req.body.email){
      res.status(400).send("This email already exists");
      return;
  }
}
  if (!req.body.email || !req.body.password) {
  res.status(400).send("please use a valid username and password")
  }

  else {
        let userID = generateRandomString()
        users[userID] = {id: userID,
                  email: req.body.email,
                  password: req.body.password
        }
        res.cookie('tinyapp', userID)
        console.log(users);
        res.redirect("/")

}
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



