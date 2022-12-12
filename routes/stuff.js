import express from "express";
import {stuffController} from '../controllers/stuff.js';
import { authMiddleware } from "../middleware/auth.js";
import multer from '../middleware/multer-config.js';

const router = express.Router()

router.post('/', authMiddleware, multer, stuffController.createThing)
router.get('/:id', authMiddleware, stuffController.getThing);
router.put('/:id', authMiddleware, multer, stuffController.modifyThing);
router.delete('/:id', authMiddleware, stuffController.deleteThing);
router.get('/', authMiddleware, stuffController.getAllThings);

export default router;