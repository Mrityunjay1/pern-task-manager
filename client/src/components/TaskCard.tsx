import { Tasks, useDeleteTasksMutation } from "@/state/api";
import Image from "next/image";
import { format } from "date-fns";
import React from "react";
import {
  CalendarIcon,
  FlagIcon,
  PaperclipIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  task: Tasks;
};

const TaskCard = ({ task }: Props) => {
  const [deleteTask] = useDeleteTasksMutation();

  const handleDelete = async () => {
    try {
      await deleteTask({ taskId: task.id }).unwrap(); // Calling the mutation
      console.log("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-lg">
      <div className="space-y-6 p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{task.title}</h2>
            <p className="text-muted-foreground">
              {task.description || "No description provided"}
            </p>
          </div>
          {/* Delete button */}
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Task details like priority, tags, dates, etc. */}
          <div className="flex items-center space-x-2">
            <FlagIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">Priority:</span>
            <span className="text-muted-foreground">{task.priority}</span>
          </div>
          {/* Other fields... */}
        </div>

        {task.attachments && task.attachments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <PaperclipIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">Attachments:</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {task.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-md"
                >
                  <Image
                    src={`/${attachment.fileURL}`}
                    alt={attachment.fileName}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {task.status}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">ID: {task.id}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
