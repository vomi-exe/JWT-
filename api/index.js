const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("./models/userModel.js");
const totp = require("totp-generator");
const fast2sms = require("fast-two-sms");
const dotenv = require("dotenv");
const path = require("path");

let verifyResponse = {};
dotenv.config();

//Connection to DB
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.ACCESS_KEY,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.REFRESH_KEY
  );
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && (await user.matchPassword(password))) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    const { password, __v, createdAt, updatedAt, _id, ...others } = user._doc;
    res.json({
      ...others,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
});

app.post("/register", async (req, res) => {
  const data = req.body;
  const userExists = await User.findOne({ email: data.email });

  if (userExists) {
    res.status(400).json("user already exists");
  }

  const user = await User.create(data);
  if (user) {
    const { password, _id, mobilenumber, ...others } = user._doc;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      _id,
      ...others,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("invalid user data");
  }
});

app.post("/generateOTP", async (req, res) => {
  const token = totp(process.env.OTP_KEY, {
    digits: 6,
    algorithm: "SHA-512",
    period: 60000,
  });
  console.log(req.body.mobilenumber);
  var options = {
    authorization: process.env.F2S_KEY,
    message: `You OTP is : ${token}`,
    numbers: [req.body.mobilenumber],
  };
  const response = await fast2sms.sendMessage(options);
  console.log(response);
});

app.post("/verify", (req, res) => {
  const token = totp(process.env.OTP_KEY, {
    digits: 6,
    algorithm: "SHA-512",
    period: 60000,
  });
  if (req.body.otpvalue === token) {
    res.status(200).json("Verified");
  } else {
    res.status(403).json("Invalid");
    console.log("INVALID");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
      req.user._id = user._id;
      next();
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.delete("/users/:userId", verify, (req, res) => {
  if (req.user._id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

app.post("/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Backend server is running!"));
