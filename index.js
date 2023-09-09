const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

mongoose
  .connect("mongodb://127.0.0.1:27017/meditactive", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Server connected"))
  .catch((err) => console.log(err));
var db = mongoose.connection;

const usersRouter = require("./routes/users");
const goalsRouter = require("./routes/goals");

app.use(express.json());
app.use(mongoSanitize());

app.use("/api/user", usersRouter);
app.use("/api/goal", goalsRouter);

app.listen(3000);
