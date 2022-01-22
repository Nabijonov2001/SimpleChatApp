const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const app = express();

const result = require("dotenv");
result.config();
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT;
const SECRET_WORD = process.env.SECRET_WORD;

//settings

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middlewares
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", async (req, res) => {
  let data = await fs.readFile(path.join(__dirname, "database.json"), "utf-8");
  data = JSON.parse(data);
  let users = data.users;
  let isUser = users.find(
    (user) => user.name.toLowerCase() === req.body.name.toLowerCase()
  );
  if (isUser) {
    let token = jwt.sign(isUser, SECRET_WORD);
    res.cookie("token", token).redirect("/chat");
  } else {
    users = users.push(req.body);
    await fs.writeFile("database.json", JSON.stringify(data));
    res.send(
      "<h3>Siz yangi foydalanuvchisiz. Siz ro`yxataga olindingiz. Iltimos qaytadan kiring!</h3>"
    );
  }
});

app.get("/chat", async (req, res) => {
  let token = jwtVerify(req.cookies.token);
  if (token) {
    let data = await fs.readFile(path.join(__dirname, "database.json"), "utf8");
    data = JSON.parse(data);
    let users = data.users;
    let messages = data.messages;
    console.log(messages);
    res.render("index", {
      users: users,
      currentUser: token.name,
      messages: messages,
    });
  } else {
    res.redirect("/");
  }
});

app.post("/chat", async (req, res) => {
  let token = jwtVerify(req.cookies.token);
  let data = await fs.readFile(path.join(__dirname, "database.json"), "utf8");
  data = JSON.parse(data);
  let messages = data.messages;

  let newMessage = {
    message_id: messages.length + 1,
    text: req.body.text,
    username: token.name,
  };

  messages = messages.push(newMessage);
  try {
    await fs.writeFile(
      path.join(__dirname, "database.json"),
      JSON.stringify(data)
    );
    res.redirect("/chat");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("SERVER LISTENING ON PORT " + PORT);
});

function jwtVerify(token) {
  try {
    return jwt.verify(token, SECRET_WORD);
  } catch (e) {
    return false;
  }
}
