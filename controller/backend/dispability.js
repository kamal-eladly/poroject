const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
} = require("../../Helper/helper");
const db = require("../../models");
const { validationResult } = require("express-validator");

const AllDisabilityController = async (req, res, next) => {
  try {
    const disability = await db.disability.findAll();
    res.render("backEnd/disability/showAll", {
      title: "All Disability",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      disability: disability,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addDisabilityController = async (req, res, next) => {
  try {
    res.render("backEnd/disability/addDisability", {
      title: "add Disability",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      admin: req.cookies.Admin,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addDisabilityControllerPost = async (req, res, next) => {
  try {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/dashpord/addDisability");
      removeImg(req);
      return;
    }

    var file = Rename_uploade_img(req);
    req.body.image = file;
    req.body.active = true;
    await db.disability.create(req.body);
    returnWithMessage(
      req,
      res,
      "/dashpord/addDisability",
      "تم اضافه اعاقه جديده بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const EditDisabilityController = async (req, res, next) => {
  try {
    const disability = await db.disability.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/disability/editDisable", {
      title: "edit User",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      disability,
      validationError: req.flash("validationError")[0],
    });
  } catch (error) {
    tryError(res, error);
  }
};
const EditdisabilityControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(
        req,
        res,
        errors,
        "/dashpord/EditDisability/" + req.params.id
      );
      return;
    }

    var file = Rename_uploade_img(req);
    if (file) {
      removeImg(req, "disabilityImage/", req.body.OlduserImage);
      req.body.image = file;
    } else {
      req.body.image = req.body.OlduserImage;
    }
    req.body.active = req.body.active ? true : false;
    await db.disability.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    returnWithMessage(
      req,
      res,
      "/dashpord/EditDisability/" + req.params.id,
      "تم تعديل الببنات بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeDisability = async (req, res, next) => {
  try {
    await db.disability.update(
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
      "/dashpord/AllDisability",
      req.query.isActive == "false"
        ? "تم التفعيل بنجاح"
        : "تم الغاء التفعيل بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const deleteDisability = async (req, res, next) => {
  try {
    await db.disability.destroy({
      where: {
        id: req.params.id,
      },
    });
    removeImg(req, "disabilityImage/", req.body.oldImage);
    returnWithMessage(
      req,
      res,
      "/dashpord/AllDisability",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeDisable = async (req, res, next) => {
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
  AllDisabilityController,
  addDisabilityController,
  EditdisabilityControllerPost,
  EditDisabilityController,
  addDisabilityControllerPost,
  activeDisability,
  deleteDisability,
};
