import { Router } from "express";
import indexGetController from "../controllers/index/index/get.js";
import aboutGetController from "../controllers/index/about/get.js";

const router = Router();

router.get('/', indexGetController);

router.get('/about', aboutGetController);

export default router;
