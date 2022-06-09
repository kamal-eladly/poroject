const { tryError, returnWithMessage } = require("../../Helper/helper");
const db = require("../../models");

const showAllUserResult = async (req, res, next) => {
  try {
    var AllUserResult = await db.usersResult.findAll({
      where: { success: null },
      include: [
        { model: db.users, as: "ResultUser" },
        {
          model: db.Testing,
          as: "ResultTesting",
          include: [{ model: db.disability, as: "TestingDisability" }],
        },
      ],
    });

    res.render("backEnd/userResults/showAll", {
      title: "all User result",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      AllUserResult,
      validationError: req.flash("validationError")[0],
    });
  } catch (error) {
    tryError(res, error);
  }
};

const correctResultPage = async (req, res, next) => {
  try {
    var UserResult = await db.usersResult.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: db.users, as: "ResultUser" },
        {
          model: db.Testing,
          as: "ResultTesting",
          include: [{ model: db.disability, as: "TestingDisability" }],
        },
      ],
    });

    res.render("backEnd/userResults/correctResult", {
      title: "correct Result",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      UserResult,
      validationError: req.flash("validationError")[0],
      correctResultPage,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const resultOfExam = async (req, res, next) => {
  try {
    await db.usersResult.update(
      { success: req.query.result == "success" ? true : false },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    returnWithMessage(
      req,
      res,
      "/dashpord/showAllUserResult",
      "تم ارسال الاجابه بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  showAllUserResult,
  correctResultPage,
  resultOfExam,
};
