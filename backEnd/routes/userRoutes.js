import express from "express"   
import { editUpdateProfile, getCurrentUser, updateUserLocation } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();


userRouter.get("/current",isAuth,getCurrentUser);
userRouter.post("/update-location",isAuth,updateUserLocation);
userRouter.post('/edit-update-profile',isAuth,upload.single("profilePicture"),editUpdateProfile);

export default userRouter