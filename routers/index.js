import { Router } from "express";

import indexGetController from "../controllers/index/index/get.js";
import aboutGetController from "../controllers/index/about/get.js";
import howtoGetController from "../controllers/index/howto/get.js";
import resultPostController from "../controllers/index/result/post.js";

const router = Router();

router.get('/',
  indexGetController
);
router.get('/about',
  aboutGetController
);

router.get('/howto',
  howtoGetController
);

router.post('/result',
  resultPostController
);

export default router;
