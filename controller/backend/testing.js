const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
  removeImgFiled,
  Rename_uploade_img_multiFild,
} = require("../../Helper/helper");
const db = require("../../models");
const { validationResult } = require("express-validator");

const AllTestingController = async (req, res, next) => {
  try {
    const Testing = await db.Testing.findAll({
      include: [
        { model: db.disability, as: "TestingDisability", attributes: ["name"] },
      ],
    });

    res.render("backEnd/Testing/showAll", {
      title: "All Testing",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      Testing: Testing,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addTestingController = async (req, res, next) => {
  try {
    var disability = await db.disability.findAll({
      where: {
        active: true,
      },
    });
    res.render("backEnd/Testing/addTesting", {
      title: "add Testing",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      admin: req.cookies.Admin,
      disability,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addTestingControllerPost = async (req, res, next) => {
  try {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/dashpord/addTesting");
      return;
    }
    var LastTeasting = await db.Testing.findOne({
      where: {
        disability: req.body.disability,
      },
      order: [["createdAt", "desc"]],
    });
    console.log(LastTeasting);

    req.body.active = true;
    req.body.numberOfTest = LastTeasting
      ? parseInt(LastTeasting.numberOfTest) + 1
      : 1;
    req.body.exam = req.body.exam.split(",");
    await db.Testing.create(req.body);
    returnWithMessage(
      req,
      res,
      "/dashpord/addTesting",
      "تم اضافه الاختبار بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const EditTestingController = async (req, res, next) => {
  try {
    const Testing = await db.Testing.findOne({
      where: {
        id: req.params.id,
      },
    });
    const disability = await db.disability.findAll({
      where: {
        active: true,
      },
    });
    res.render("backEnd/Testing/editTesting", {
      title: "edit Testing",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      Testing,
      validationError: req.flash("validationError")[0],
      disability,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const EditTestingControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(
        req,
        res,
        errors,
        "/dashpord/EditTesting/" + req.params.id
      );
      return;
    }
    req.body.active = req.body.active ? true : false;
    req.body.exam = req.body.exam.split(",");
    await db.Testing.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    returnWithMessage(
      req,
      res,
      "/dashpord/EditTesting/" + req.params.id,
      "تم تعديل الببنات بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeTesting = async (req, res, next) => {
  try {
    await db.Testing.update(
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
      "/dashpord/AllTesting",
      req.query.isActive == "false"
        ? "تم التفعيل بنجاح"
        : "تم الغاء التفعيل بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const deleteTesting = async (req, res, next) => {
  try {
    await db.Testing.destroy({
      where: {
        id: req.params.id,
      },
    });

    returnWithMessage(
      req,
      res,
      "/dashpord/AllTesting",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  AllTestingController,
  addTestingController,
  EditTestingControllerPost,
  EditTestingController,
  addTestingControllerPost,
  activeTesting,
  deleteTesting,
};
