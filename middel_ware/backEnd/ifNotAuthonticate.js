/*--------------------------- start check if user is admin or not ---------------------*/
const isNotAuthonticate = async (req, res, next) => {
  var Admin = req.cookies.Admin;
  if (Admin) {
    res.redirect("/dashpord");
  } else {
    next();
  }
};
/*--------------------------- end check if user is admin or not ---------------------*/

module.exports = {
  isNotAuthonticate,
};
