const {
  AllTestingController,
  EditTestingController,
  activeTesting,
  deleteTesting,
  EditTestingControllerPost,
  addTestingController,
  addTestingControllerPost,
} = require("../../controller/backend/Testing");
const { uploade_img, uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");

const {
  TestingValidation,
} = require("../../validation/backEnd/Testing.validation");

const router = require("express").Router();

router.get("/AllTesting", isAuthonticate, AllTestingController);
router.get("/addTesting", isAuthonticate, addTestingController);
router.post(
  "/addTesting",
  isAuthonticate,
  TestingValidation(),
  addTestingControllerPost
);
router.get("/EditTesting/:id", isAuthonticate, EditTestingController);
router.post(
  "/EditTesting/:id",
  isAuthonticate,
  TestingValidation(),
  EditTestingControllerPost
);
router.get("/activeTesting/:id", isAuthonticate, activeTesting);
router.post("/deleteTesting/:id", isAuthonticate, deleteTesting);

module.exports = {
  TestingRouter: router,
};
