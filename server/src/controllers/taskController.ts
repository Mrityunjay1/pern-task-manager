import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
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
  } catch (err) {
    res.status(500).json({ message: "Error retriving tasks" });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status,
      },
    });
    res.status(200).json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ message: `Error updating tasks: ${err.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const task = await prisma.task.create({
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
  } catch (err) {
    console.error("Error creating task:", err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });
    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
};
