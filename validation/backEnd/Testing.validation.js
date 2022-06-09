const { check } = require("express-validator");

const TestingValidation = () => {
  return [
    check("exam").notEmpty().withMessage("ادخل الكلمه او الجمله المراد نطقها "),
    check("disability").notEmpty().withMessage("ادخل اسم الاعاقه"),
  ];
};

module.exports = {
  TestingValidation,
};
