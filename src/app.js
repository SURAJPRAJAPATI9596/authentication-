const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
//=============================importing routes=============================================
const userRoute = require("./routes/user.routes");
// ========================using controllers and middlewares===================================
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth", userRoute);
//=================export=============================
module.exports = app;
