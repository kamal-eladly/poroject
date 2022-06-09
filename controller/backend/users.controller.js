const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
} = require("../../Helper/helper");
const db = require("../../models");
const { validationResult } = require("express-validator");

const AllUsersController = async (req, res, next) => {
  try {
    const users = await db.users.findAll();
    res.render("backEnd/users/showAll", {
      title: "All Users",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      users: users,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const EditUsersController = async (req, res, next) => {
  try {
    const user = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/users/editUser", {
      title: "edit User",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      user: user,
      validationError: req.flash("validationError")[0],
    });
  } catch (error) {
    tryError(res, error);
  }
};
const EditUsersControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(
        req,
        res,
        errors,
        "/dashpord/EditUsers/" + req.params.id
      );
      return;
    }

    var file = Rename_uploade_img(req);
    if (file) {
      removeImg(req, "users/", req.body.OlduserImage);
      req.body.image = file;
    } else {
      req.body.image = req.body.OlduserImage;
    }
    req.body.gender = req.body.gender == "1" ? true : false;
    req.body.active = req.body.active ? true : false;
    req.body.isAdmin = req.body.isAdmin ? true : false;
    req.body.isDoctor = req.body.isDoctor ? true : false;
    req.body.Disability =
      req.body.Disability.length > 1
        ? req.body.Disability
        : [req.body.Disability];
    console.log(req.body);
    await db.users.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    returnWithMessage(
      req,
      res,
      "/dashpord/EditUsers/" + req.params.id,
      "تم تعديل الببنات بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeUser = async (req, res, next) => {
  try {
    await db.users.update(
      { active: req.query.isActive == "true" ? false : true },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    returnWithMessage(
      req,
      res,
      "/dashpord/allUsers",
      req.query.isActive == "false"
        ? "تم التفعيل بنجاح"
        : "تم الغاء التفعيل بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await db.users.destroy({
      where: {
        id: req.params.id,
      },
    });
    removeImg(req, "users/", req.body.oldImage);
    returnWithMessage(
      req,
      res,
      "/dashpord/allUsers",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  AllUsersController,
  EditUsersControllerPost,
  EditUsersController,
  activeUser,
  deleteUser,
};
