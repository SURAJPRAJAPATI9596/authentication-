const express = require("express");
const { register } = require("../controllers/user.controller");
const router = express.Router();
//=====================importing controllers=================================
const authController = require("./../controllers/user.controller");
const isAuth = require("./../middlewares/isAuth.middleware");
//=====================user all controllers=================================

router.route("/register").post(authController.register);
router.route("/verify-email/:token").post(authController.verify);
router.route("/login").post(authController.login);
router.route("/verify-otp").post(authController.verifyOtp);
router.route("/get-me").get(isAuth, authController.getMe);
router.route("/refresh-access-token").post(authController.refreshAccessToken);
router.route("/logout").post(isAuth, authController.logOut);

module.exports = router;
