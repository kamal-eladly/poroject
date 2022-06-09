const { check } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../models");

const signUpUserValidation = () => {
  return [
    check("name").notEmpty().withMessage("يجب ادخال الاسم الخاص بك"),
    check("Disability")
      .notEmpty()
      .withMessage("يجب ادخال نوع الاعاقه الخاصه بك"),
    check("age").notEmpty().withMessage("يجب ادخال العمر الخاص بك"),
    check("gender").notEmpty().withMessage("يجب ادخال نوعك"),
    check("email")
      .notEmpty()
      .withMessage("ادخل الايميل")
      .isEmail()
      .withMessage("ادخل الايميل صحيح")
      .custom(async (value, { req }) => {
        console.log(value);
        var user = await db.users.findOne({
          where: {
            email: value,
            id: {
              [Op.ne]: req.body.userId ? req.body.userId : 0,
            },
          },
        });
        console.log(user);
        if (user) {
          throw new Error();
        }
        return true;
      })
      .withMessage("هذا الايميل موجود بالفعل"),
    check("password")
      .notEmpty()
      .withMessage("ادخل الرقم السري")
      .custom(async (value, { req }) => {
        if (req.url == "/editPersonalInformation") return true;
        var count = 0;
        for (var i = 0; i < value.length; i++) {
          if (isNaN(value[i])) {
            count++;
          }
        }
        if (count < 4) {
          throw new Error();
        }
        return true;
      })
      .withMessage("الرقم السري اللذي ادخلته يجب ان يحتوي علي احرف"),

    check("image")
      .custom(async (value, { req }) => {
        if (!req.files.length && req.url != "/editPersonalInformation") {
          throw new Error("");
        }
        return true;
      })
      .withMessage("ادخل الصوره الخاصه بك")
      .custom(async (value, { req }) => {
        if (!req.files.length) return true;
        req.files.forEach((element) => {
          var arrayExtention = ["jpg", "png", "jpeg", "gif", "svg"];
          var originalname = element.originalname.split(".");
          var imgExtension =
            originalname[originalname.length - 1].toLowerCase();
          if (!arrayExtention.includes(imgExtension)) {
            throw new Error("");
          }
        });
      })
      .withMessage(`The image extension must be jpg, jpeg, png, gif, svg`)
      .custom(async (value, { req }) => {
        if (!req.files.length) return true;
        req.files.forEach((element) => {
          if (element.size > 2000000) {
            throw new Error("");
          }
        });
      })
      .withMessage("The image must not be more than 200000 kb"),
  ];
};

module.exports = {
  signUpUserValidation,
};
