const {
  tryError,
  returnWithMessage,
  handel_validation_errors,
  Rename_uploade_img,
  removeImg,
} = require("../../Helper/helper");
const db = require("../../models");
const paginate = require("express-paginate");
const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { sendEmail } = require("../../emails/sendEmails");
const homePage = async (req, res, next) => {
  try {
    res.render("frontEnd/userPage/homePage", {
      title: "home",
      URL: req.url,
      notification: req.flash("notification")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    var userResult = await db.usersResult.findAll({
      where: {
        userId: req.cookies.User.id,
        success: true,
      },
    });
    res.render("frontEnd/userPage/userProfile", {
      title: "user Profile",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      userResult,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "userProfile");
      return;
    }
    var user = req.cookies.User;
    var compPassword = bcrypt.compareSync(req.body.password, user.password);
    if (compPassword) {
      var newPassword = bcrypt.hashSync(req.body.newPassword, 10);
      await db.users.update(
        { password: newPassword },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.clearCookie("User");
      returnWithMessage(
        req,
        res,
        "/userProfile",
        "تم تغير كلمه السر بنجاح",
        "success"
      );
    } else {
      returnWithMessage(
        req,
        res,
        "/userProfile",
        "الرقم السري اللذي ادخلته خاطا",
        "danger"
      );
    }
  } catch (error) {
    tryError(res, error);
  }
};

const ourService = async (req, res, nest) => {
  try {
    res.render("frontEnd/userPage/ourService", {
      title: "our service",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res);
  }
};

const ourTraining = async (req, res, nest) => {
  try {
    var { limit, page } = req.query;
    var allTraining = await db.training.findAndCountAll({
      limit: limit,
      offset: (parseInt(page) - 1) * page,
      where: {
        active: true,
      },
      include: [{ model: db.disability, as: "trainingDisability" }],
    });
    res.render("frontEnd/userPage/training", {
      title: "our service",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      allTraining,
      page,
      pages: paginate.getArrayPages(req)(
        limit,
        Math.ceil(allTraining.count / limit),
        page
      ),
    });
  } catch (error) {
    tryError(res, error);
  }
};

const yourTraining = async (req, res, nest) => {
  try {
    var { limit, page } = req.query;
    var MyTraining = await db.training.findAndCountAll({
      limit: limit,
      offset: (parseInt(page) - 1) * page,
      where: {
        active: true,
        disability: {
          [Op.in]: req.cookies.User.Disability,
        },
      },
      include: [{ model: db.disability, as: "trainingDisability" }],
    });
    res.render("frontEnd/userPage/yourTraining", {
      title: "my Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      MyTraining,
      page,
      pages: paginate.getArrayPages(req)(
        limit,
        Math.ceil(MyTraining.count / limit),
        page
      ),
    });
  } catch (error) {
    tryError(res, error);
  }
};

const showTraining = async (req, res, nest) => {
  try {
    var showTraining = await db.training.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("frontEnd/userPage/showTraining", {
      title: "show Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      showTraining,
    });
  } catch (error) {
    tryError(res);
  }
};

const allTesting = async (req, res, nest) => {
  try {
    var allTestResult = await db.usersResult.findAll({
      attributes: ["test"],
      where: {
        userId: req.cookies.User.id,
        success: true,
      },
    });
    var resultArr = [];
    allTestResult.forEach((ele) => {
      resultArr.push(ele.test);
    });
    var allTesting = await db.Testing.findAll({
      include: [
        {
          model: db.disability,
          as: "TestingDisability",
          attributes: ["name"],
        },
      ],
      order: [
        ["disability", "asc"],
        ["numberOfTest", "asc"],
      ],
      where: {
        id: {
          [Op.notIn]: resultArr,
        },
        disability: {
          [Op.in]: req.cookies.User.Disability,
        },
      },
    });
    res.render("frontEnd/userPage/allTesting", {
      title: "show Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      allTesting,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const enterExam = async (req, res, nest) => {
  try {
    var TestResult = await db.usersResult.findOne({
      attributes: ["test", "success"],
      where: {
        userId: req.cookies.User.id,
        test: req.params.id,
      },
    });
    var message = "";
    if (TestResult && TestResult.success == null) {
      message = "لقد قمت بدخول هذا الامتحان انتظر النتيجه ....";
    } else if (TestResult && TestResult.success) {
      message = "لقد دخلت هذا الامتحان واجتزته بالفعل انتظر الاختبارات الاخري";
    } else if (TestResult && !TestResult.success) {
      await db.usersResult.update(
        { success: null },
        {
          where: {
            userId: req.cookies.User.id,
            test: req.params.id,
          },
        }
      );
    }
    if (message) {
      returnWithMessage(req, res, "/allTesting", message, "success");
      return;
    }
    var myExam = await db.Testing.findOne({
      include: [
        {
          model: db.disability,
          as: "TestingDisability",
          attributes: ["name"],
        },
      ],

      where: {
        id: req.params.id,
      },
    });

    res.render("frontEnd/userPage/enterExam", {
      title: "show Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      myExam,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const sendResult = async (req, res, nest) => {
  try {
    var userResult = await db.usersResult.findOne({
      where: {
        userId: req.cookies.User.id,
        test: req.params.id,
      },
    });
    var file = Rename_uploade_img(req);

    if (userResult) {
      removeImg(req, "users/audio/", userResult.audio);
      await db.usersResult.update(
        { audio: file },
        {
          where: {
            userId: req.cookies.User.id,
            test: req.params.id,
          },
        }
      );
    } else {
      await db.usersResult.create({
        userId: req.cookies.User.id,
        audio: file,
        test: req.params.id,
      });
    }
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};

const resultPage = async (req, res, nest) => {
  try {
    var AllUserResult = await db.usersResult.findAll({
      where: {
        userId: req.cookies.User.id,
        success: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: db.Testing,
          as: "ResultTesting",
          attributes: ["numberOfTest", "id"],
          include: [
            {
              model: db.disability,
              as: "TestingDisability",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    res.render("frontEnd/userPage/resultPage", {
      title: "show test",
      URL: req.url,
      AllUserResult,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      allTesting,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const contactUs = async (req, res, nest) => {
  try {
    res.render("frontEnd/userPage/contactUs", {
      title: "show Training",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
      allTesting,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const contactUsPost = async (req, res, nest) => {
  try {
    await db.contactUs.create({
      userId: req.cookies.User.id,
      message: req.body.message,
    });
    returnWithMessage(
      req,
      res,
      "/contactUs",
      "تم ارسال الرساله بنجاح انتظر الرد علي الايميل اللذي قمت بالتسجيل به علي الموقع",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const EditPersonalInformation = async (req, res, nest) => {
  try {
    var disabilitys = await db.disability.findAll({
      where: {
        active: true,
      },
    });
    res.render("frontEnd/userPage/editPersonalInformation", {
      title: "Edit Personal Information",
      URL: req.url,
      disabilitys,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res);
  }
};
const EditPersonalInformationPost = async (req, res, nest) => {
  try {
    var errors = await validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(req, res, errors, "/editPersonalInformation");
      return;
    }
    var file = Rename_uploade_img(req);
    if (file) {
      removeImg(req, "users/", req.body.oldImage);
    }
    req.body.image = file ? file : req.body.oldImage;
    req.body.gender = req.body.gender == "1" ? true : false;
    req.body.Disability =
      req.body.Disability.length > 1
        ? req.body.Disability
        : req.body.Disability.split(",");
    await db.users.update(req.body, {
      where: {
        id: req.cookies.User.id,
      },
    });
    res.clearCookie("User");

    returnWithMessage(
      req,
      res,
      "/editPersonalInformation",
      "تم تعديل بياناتك بنجاح قم بتسجيل الدخول مره اخري",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  homePage,
  showTraining,
  userProfile,
  changePassword,
  contactUs,
  ourTraining,
  EditPersonalInformation,
  ourService,
  EditPersonalInformationPost,
  ourTraining,
  yourTraining,
  resultPage,
  contactUsPost,
  allTesting,
  enterExam,
  sendResult,
};
