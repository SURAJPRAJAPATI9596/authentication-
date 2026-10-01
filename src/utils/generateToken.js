const jwt = require("jsonwebtoken");
const { redisClient } = require("./../config/redis");
//=======================================================generate token=======================================================================

const generateToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const refreshTokenKey = `refresh_token:${id}`;
  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    //    secure: true,
    maxAge: 1 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    //    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
//=======================================================verify Refresh Token=======================================================================
const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const storedToken = await redisClient.get(`refresh_token:${decoded.id}`);

    if (storedToken === refreshToken) {
      return decoded;
    }

    return null;
  } catch (error) {
    return null;
  }
};
//=======================================================Generate access token=======================================================================
const generateAccessToken = (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    //    secure: true,
    maxAge: 1 * 60 * 1000,
  });
};
//=======================================================revoke refresh token=======================================================================
const revokeRefreshToken = async (uid) => {
  await redisClient.del(`refresh_token:${uid}`);
};
module.exports = {
  generateToken: generateToken,
  generateAccessToken: generateAccessToken,
  verifyRefreshToken: verifyRefreshToken,
  revokeRefreshToken: revokeRefreshToken,
};
