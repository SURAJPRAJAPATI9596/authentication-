const apiResponse = require("./../utils/apiResponse");
const bcrypt = require("bcrypt");
const asyncHandler = require("./../utils/asyncHandler");
const { redisClient } = require("./../config/redis");
const User = require("./../models/user.model");
const crypt = require("crypto");
const sendEmail = require("./../services/email.service");
const verificationEmailTemplate = require("./../utils/verificationEmailTemplate");
const otpEmailTemplate = require("./../utils/otpEmailTemplate");
const generateToken = require("./../utils/generateToken");
const jwt = require("jsonwebtoken");
//===================================-====registration====================================================
const register = asyncHandler(async (req, res) => {
  //   res.send("Hey user  we are registering you");
  const { email, userName, password } = req.body;
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res
      .status(429)
      .json(new apiResponse(429, null, "Too many request, try again later"));
  }
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json(
        new apiResponse(400, email, "This email already exist in our database"),
      );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypt.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;
  const dataToStore = JSON.stringify({
    userName,
    email,
    password: hashedPassword,
  });
  await redisClient.set(verifyKey, dataToStore, { EX: 300 });
  const subject = "Hey user verify your email";
  const htmlTemplate = verificationEmailTemplate(email, verifyToken);
  await sendEmail(email, subject, htmlTemplate);
  await redisClient.set(rateLimitKey, "true", { EX: 120 });
  res.json(
    new apiResponse(
      null,
      null,
      "If your email is valid a verification link has been sent to your email, it will expire in 5min ",
    ),
  );

  //ending
});
//====================================verification controller=======================================================
const verify = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Verification token is required"));
  }
  const verifyKey = `verify:${token}`;
  const userDataJSON = await redisClient.get(verifyKey);
  if (!userDataJSON) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Verification link is expired"));
  }
  await redisClient.del(verifyKey);
  const userData = JSON.parse(userDataJSON);
  const newUser = await User.create({
    userName: userData.userName,
    password: userData.password,
    email: userData.email,
  });
  await newUser.save();
  res
    .status(201)
    .json(new apiResponse(201, newUser, "User created successfully"));
});
//===============================================login user ==================================================================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res
      .status(429)
      .json(new apiResponse(429, null, "Too many request, try again later"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid credentials"));
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid credentials"));
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 });
  const subject = "Otp for verification";
  const html = otpEmailTemplate(user.userName, otp);
  await sendEmail(email, subject, html);
  redisClient.set(rateLimitKey, "true", { EX: 60 });
  res
    .status(202)
    .json(
      new apiResponse(
        202,
        null,
        "An otp has been sent to your registered email address it will be valid for 5 min",
      ),
    );
});
//===============================================verify otp ==================================================================
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email and otp both are required"));
  }
  const otpKey = `otp:${email}`;
  const storedOtpString = await redisClient.get(otpKey);
  if (!storedOtpString) {
    return res.status(400).json(new apiResponse(400, null, "OTP expired"));
  }
  const storedOtp = JSON.parse(storedOtpString);
  if (otp !== storedOtp) {
    return res.status(400).json(new apiResponse(400, null, "Otp is invalid"));
  }
  redisClient.del(otpKey);
  const user = await User.findOne({ email });
  const tokenData = await generateToken.generateToken(user._id, res);
  res.status(200).json(new apiResponse(200, user, `Welcome ${user.userName}`));
});
//===============================================get me ==================================================================
const getMe = asyncHandler((req, res) => {
  const user = req.user;
  res.json(new apiResponse(null, user, null));
});

//===============================================refresh token ==================================================================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "you are not logedin"));
  }

  const decode = await generateToken.verifyRefreshToken(refreshToken);

  if (!decode) {
    return res
      .status(401)
      .json(new apiResponse(401, null, "Invalid refreshToken"));
  }
  await generateToken.generateAccessToken(decode.id, res);
  res.status(200).json(new apiResponse(200, null, "Token refreshed success"));
});

//===============================================logout ==================================================================
const logOut = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await generateToken.revokeRefreshToken(userId);
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  await redisClient.del(`user:${userId}`);
  res.status(200).json(new apiResponse(200, null, "logout success"));
});
module.exports = {
  register: register,
  verify: verify,
  login: login,
  verifyOtp: verifyOtp,
  getMe: getMe,
  refreshAccessToken: refreshAccessToken,
  logOut: logOut,
};
