import { Router } from "express";
import indexGetController from "../controllers/index/index/get.js";
import aboutGetController from "../controllers/index/about/get.js";
import playGetController from "../controllers/play/get.js";

const router = Router();

router.get('/', indexGetController);

router.get('/about', aboutGetController);

router.get('/play', playGetController);

export default router;
