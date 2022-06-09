const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

const path = require("path");
const db = require("./models");
const paginate = require("express-paginate");
const session = require("express-session");
const flash = require("connect-flash");
const cookies = require("cookie-parser");
const { dashpordRouter } = require("./router/backEnd/dashpored");
const { authAdmin } = require("./router/backend/auth.router");
const { userRoutes } = require("./router/frontEnd/userPagesRoutes");
const { authUserRoutes } = require("./router/frontEnd/auth/auth");
const { usersRouter } = require("./router/backend/users_router");
const { dispabilityRouter } = require("./router/backend/disability.router");
const { trainingRouter } = require("./router/backend/training.router");
const { TestingRouter } = require("./router/backend/testIng.router");
const { messagesRouter } = require("./router/backend/messages.router");
const { allUserResult } = require("./router/backend/UserResult");

/*--------------------------- start sockit Io ----------------------------------*/
var activeUser = {};

/* ------------- set seting -------------------*/
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookies());
app.use(
  session({
    secret:
      "هذا الاوبشن خاص بالتشفير يطلب منك نص معين يستخدمه هو عند التشفير وكلما زاد هذا النص زاد الحمايه",
    saveUninitialized: false, // معناها انه عند عمل session لاتقوم بحفظها في الداتابيز الا عندما امرك بذالك
    /*cookie : { // السشن ده هو في الاصل عباره عن cookie لذالك انا اقوم بتحديد بعض القيم لتحديد مده الانتهاء الديفولت هو عند اغلاق المتصفح
        //maxAge : 1 * 60 * 60 * 100, 
    },*/
    resave: true,
  })
);
app.use(flash());
app.use(paginate.middleware(2, 20));
/* ------------- set seting -------------------*/
app.use("/", dashpordRouter);
app.use("/dashpord", authAdmin);
app.use("/dashpord", usersRouter);
app.use("/dashpord", dispabilityRouter);
app.use("/dashpord", trainingRouter);
app.use("/dashpord", TestingRouter);
app.use("/dashpord", messagesRouter);
app.use("/dashpord", allUserResult);
app.use("/", authUserRoutes);
app.use("/", userRoutes);

app.use((req, res, next) => {
  res.render("error", { message: "this page not hir", title: "Error Page" });
});
/*--------------------------- end route  ----------------------------------*/

server.listen("5000", () => {
  console.log("server starte 5000");
});
