import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

// Mock API endpoints

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", deleteTask);

export default router;
