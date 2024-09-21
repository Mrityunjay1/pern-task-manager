import { Router } from "express";
import { getProjects } from "../controllers/projectController";

const router = Router();

// Mock API endpoints

router.get("/", getProjects);

export default router;
