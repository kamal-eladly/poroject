const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
} = require("../../../Helper/helper");
const db = require("../../../models");
const { sendEmail } = require("../../../emails/sendEmails");
const { Op } = require("sequelize");

const signInUser = async (req, res, next) => {
  try {
    res.render("frontEnd/auth/signIn", {
      title: "signIn User",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res);
  }
};
const signInUserPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    var userData = req.body;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "signIn");
      return;
    }
    var user = await db.users.findOne({
      where: {
        email: {
          [Op.eq]: userData.email,
        },
      },
    });
    if (user) {
      var password = bcrypt.compareSync(userData.password, user.password);
      if (!password) {
        returnWithMessage(
          req,
          res,
          "signIn",
          "الرقم السري اللذي ادخلته خاطا",
          "danger"
        );
      } else {
        if (!user.active) {
          returnWithMessage(
            req,
            res,
            "signIn",
            "هذا الايميل موجود ولاكن يجب تفعيله لقد قمنا بارسال رساله علي الجميل الخاص بك",
            "danger"
          );
        } else {
          var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};
          var message = userData.rememberMe
            ? "تم تسجيل دخولك بنجاح"
            : "تم تسجيل دخولك بنجاح " + "ولاكن سوف يتم تسجيل خروجك بعد 24 ساعه";
          res.cookie("User", user, expire);
          returnWithMessage(req, res, "/home", message, "success");
        }
      }
    } else {
      returnWithMessage(
        req,
        res,
        "signIn",
        "هذا الايميل لا يمتلك اي حساب",
        "danger"
      );
    }
  } catch (error) {
    tryError(res);
  }
};

const signUpUser = async (req, res, next) => {
  try {
    var disabilitys = await db.disability.findAll({
      where: {
        active: true,
      },
    });
    res.render("frontEnd/auth/signUp", {
      title: "signUp User",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      disabilitys,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const signUpUserPost = async (req, res, next) => {
  try {
    var errors = await validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(req, res, errors, "/signUp");
      return;
    }
    var file = Rename_uploade_img(req);
    var Password = bcrypt.hashSync(req.body.password, 10);
    req.body.password = Password;
    req.body.image = file;
    req.body.gender = req.body.gender == "1" ? true : false;
    req.body.Disability =
      req.body.Disability.length > 1
        ? req.body.Disability
        : [req.body.Disability];
    req.body.isDoctor = false;
    req.body.isAdmin = false;
    req.body.active = false;
    await db.users.create(req.body).then((result) => {
      4;
      sendEmail(
        result.email,
        result.id,
        result.name,
        "يجب تفعيل الاكونت الخاص بك اولا",
        "activeUserPage"
      );
    });
    returnWithMessage(
      req,
      res,
      "/signUp",
      "تم تسجيل بياناتك لقد قمنا بارسال رساله علي الجميل الخاص بك لتفعيل الحساب",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
}; /*----------------------------------- start active user page ------------------------------*/
const activeUserPage = async (req, res, next) => {
  try {
    await db.users.update(
      {
        active: true,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    returnWithMessage(
      req,
      res,
      "/signIn",
      "تم تفعيلك كمستخدم جديد قم بالتسجيل",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------------------- end active user page ------------------------------*/

/*-----------------------------------  ------------------------------*/
const signOutUser = async (req, res, next) => {
  try {
    res.clearCookie("User");
    res.redirect("/signIn");
  } catch (error) {}
};
/*----------------------------------- start sign Out ------------------------------*/

module.exports = {
  signInUser,
  signUpUser,
  signUpUserPost,
  signInUserPost,
  signOutUser,
  activeUserPage,
};
