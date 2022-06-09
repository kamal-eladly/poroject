const e = require("connect-flash");
const { tryError, returnWithMessage } = require("../../Helper/helper");
const { sendEmail } = require("../../emails/sendEmails");
const db = require("../../models");

const AllMessageController = async (req, res, next) => {
  try {
    const Message = await db.contactUs.findAll({
      include: [{ model: db.users, as: "contactUsUser" }],
    });

    res.render("backEnd/Message/showAll", {
      title: "All Message",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      Message: Message,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const responsMessage = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    var message = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/Message/responsMessage", {
      title: "All Message",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      user,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const responsMessagePost = async (req, res, next) => {
  try {

    sendEmail(req.body.email, null, req.body.name, req.body.message, null);
    returnWithMessage(
      req,
      res,
      "/dashpord/responsMessage/" + req.params.id,
      `تم الرد علي ${req.body.name} بنجاح`,
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
const deleteMessage = async (req, res, next) => {
  try {
    await db.contactUs.destroy({
      where: {
        id: req.params.id,
      },
    });

    returnWithMessage(
      req,
      res,
      "/dashpord/AllMessage",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  AllMessageController,
  deleteMessage,
  responsMessage,
  responsMessagePost,
};
