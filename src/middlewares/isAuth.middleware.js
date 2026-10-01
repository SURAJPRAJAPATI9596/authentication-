const { redisClient } = require("../config/redis");
const apiResponse = require("./../utils/apiResponse");
const User = require("./../models/user.model");

const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(403)
        .json(new apiResponse(403, null, "please login -no token foud"));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) {
      return res.status(400).json(new apiResponse(400, null, "token expired"));
    }
    const cacheUser = await redisClient.get(`user:${decodedData.id}`);
    if (cacheUser) {
      req.user = JSON.parse(cacheUser);

      return next();
    }
    const user = await User.findById(decodedData.id);
    if (!user) {
      return res
        .status(400)
        .json(new apiResponse(400, null, "No user with this id exist"));
    }

    await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify(user));
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json(new apiResponse(500, null, error.message));
  }
};

module.exports = isAuth;
