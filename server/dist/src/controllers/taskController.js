"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.createTask = exports.updateTaskStatus = exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.query;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        res.status(200).json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: "Error retriving tasks" });
    }
});
exports.getTasks = getTasks;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = yield prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status,
            },
        });
        res.status(200).json(updatedTask);
    }
    catch (err) {
        res.status(500).json({ message: `Error updating tasks: ${err.message}` });
    }
});
exports.updateTaskStatus = updateTaskStatus;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId, } = req.body;
    try {
        const task = yield prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate: startDate ? new Date(startDate) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                points: points ? parseInt(points, 10) : undefined,
                projectId: parseInt(projectId, 10),
                authorUserId: parseInt(authorUserId, 10),
                assignedUserId: assignedUserId
                    ? parseInt(assignedUserId, 10)
                    : undefined,
            },
        });
        res.status(201).json(task);
    }
    catch (err) {
        console.error("Error creating task:", err);
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const deletedTask = yield prisma.task.delete({
            where: {
                id: Number(taskId),
            },
        });
        res.status(200).json(deletedTask);
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting task" });
    }
});
exports.deleteTask = deleteTask;
