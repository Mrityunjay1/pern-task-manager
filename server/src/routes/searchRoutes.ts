import { Router } from "express";

import { search } from "../controllers/searchController";

const router = Router();

// Mock API endpoints

router.get("/", search);

export default router;
