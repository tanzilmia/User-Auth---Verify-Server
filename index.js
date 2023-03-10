const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth =  require("./Routes/authentication")
require("dotenv").config();


// middleware
app.use(cors());
app.use(express.json());

// check .env file for databes user and password and give a Name
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nz3kcdw.mongodb.net/Authentication?retryWrites=true&w=majority`;
// conncet with mongodb
console.log(mongoUrl);
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    console.log("connceted mongoose");
  })
  .catch((e) => console.log(e));


// testing

app.use("/auth", auth)

app.listen(port, () => {
  console.log(` Website on port ${port}`);
});