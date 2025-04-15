import  express from "express";
import dummyController from "../controllers/dummy_controller"

const router = express.Router();

router.get('/dummy', dummyController.dummy);

export default router;