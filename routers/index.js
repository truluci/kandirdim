import { Router } from "express";
import indexGetController from "../controllers/index/index/get.js";

const router = Router();

router.get('/', indexGetController);

router.get('/about', (req, res) => {
    res.send('About page');
});

router.get('/contact', (req, res) => {
    res.send('Contact page');
});

export default router;
