const express = require("express");

const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");

const users = [
  {
    id: "1",
    username: "john",
    password: "password",
    isAdmin: true,
  },
  {
    id: "2",
    username: "jane",
    password: "password",
    isAdmin: false,
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if (user) {
    //Generate token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      "SecretKey"
    );
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } else {
    res.status(400).json("username or password incorrect");
  }
});

app.listen(5000, function (req, res) {
  console.log("listening on 5000");
});
