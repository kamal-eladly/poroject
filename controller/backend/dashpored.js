const { tryError } = require("../../Helper/helper");
const db = require("../../models");

const dashpord_page_controller = async (req, res, next) => {
  try {
    var users = await db.users.findAll({});
    var disability = await db.disability.findAll({});
    var Testing = await db.Testing.findAll({});
    var training = await db.training.findAll({});
    res.render("backEnd/dashpord", {
      title: "dashpord",
      URL: req.url,
      users,
      disability,
      Testing,
      training,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
    });
  } catch (error) {
    tryError(res);
  }
};

module.exports = {
  dashpord_page_controller,
};
