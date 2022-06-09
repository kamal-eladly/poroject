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

const AllTrainingController = async (req, res, next) => {
  try {
    const Training = await db.training.findAll({
      include: [
        {
          model: db.disability,
          as: "trainingDisability",
          attributes: ["name"],
        },
      ],
    });

    res.render("backEnd/training/showAll", {
      title: "All Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      Training: Training,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addTrainingController = async (req, res, next) => {
  try {
    var disability = await db.disability.findAll({
      where: {
        active: true,
      },
    });
    res.render("backEnd/Training/addTraining", {
      title: "add Training",
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

const addTrainingControllerPost = async (req, res, next) => {
  try {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/dashpord/addTraining");
      removeImgFiled([req.files.image, req.files.video]);
      return;
    }

    var file = Rename_uploade_img_multiFild([req.files.image, req.files.video]);
    req.body.image = file.image ? file.image : "";
    req.body.video = file.video ? file.video : "";
    req.body.active = true;
    await db.training.create(req.body);
    returnWithMessage(
      req,
      res,
      "/dashpord/addTraining",
      "تم اضافه تدريب جديده بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const EditTrainingController = async (req, res, next) => {
  try {
    const Training = await db.training.findOne({
      where: {
        id: req.params.id,
      },
    });
    const disability = await db.disability.findAll({
      where: {
        active: true,
      },
    });
    res.render("backEnd/Training/editTraining", {
      title: "edit Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      Training,
      validationError: req.flash("validationError")[0],
      disability,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const EditTrainingControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImgFiled([req.files.image, req.files.video]);
      handel_validation_errors(
        req,
        res,
        errors,
        "/dashpord/EditTraining/" + req.params.id
      );
      return;
    }

    var files = Rename_uploade_img_multiFild([
      req.files.image,
      req.files.video,
    ]);
    if (files.image) {
      removeImg(req, "trainingImage/", req.body.oldImage);
      req.body.image = files.image;
    } else {
      req.body.image = req.body.OlduserImage;
    }
    if (files.video) {
      if (req.body.oldVideo)
        removeImg(req, "trainingImage/", req.body.oldVideo);
      req.body.video = files.video;
    } else {
      req.body.video = req.body.oldVideo;
    }
    req.body.active = req.body.active ? true : false;
    await db.training.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    returnWithMessage(
      req,
      res,
      "/dashpord/EditTraining/" + req.params.id,
      "تم تعديل الببنات بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeTraining = async (req, res, next) => {
  try {
    await db.training.update(
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
      "/dashpord/AllTraining",
      req.query.isActive == "false"
        ? "تم التفعيل بنجاح"
        : "تم الغاء التفعيل بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const deleteTraining = async (req, res, next) => {
  try {
    await db.training.destroy({
      where: {
        id: req.params.id,
      },
    });
    removeImg(req, "trainingImage/", req.body.oldImage);
    if (req.body.oldVideo) removeImg(req, "trainingImage/", req.body.oldVideo);
    returnWithMessage(
      req,
      res,
      "/dashpord/AllTraining",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  AllTrainingController,
  addTrainingController,
  EditTrainingControllerPost,
  EditTrainingController,
  addTrainingControllerPost,
  activeTraining,
  deleteTraining,
};
