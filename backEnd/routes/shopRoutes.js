import express from "express"
import { createOrEditShop, getMyShop, getShopByCity } from "../controllers/shopController.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();


shopRouter.post("/crate-edit",isAuth,upload.single("image"),createOrEditShop);
shopRouter.get("/get-my-shop",isAuth,getMyShop);
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity);

export default shopRouter