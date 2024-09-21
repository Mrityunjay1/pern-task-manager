import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tasks as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const tasksCount = tasks.filter((task) => task.status === status).length;
  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };
  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-500" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-slate-500">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-slate-950"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-slate-100">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-slate-950 dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>
  );
};

interface TaskProps {
  task: TaskType;
}

const TaskCard = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "PP")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "PP")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;
  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => {
    return (
      <div
        className={`rounded-full px-4 ${priority === "Urgent" ? "bg-red-400" : priority === "High" ? "bg-yellow-400" : "bg-green-400"}`}
      >
        {priority}
      </div>
    );
  };

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 overflow-hidden rounded-lg bg-card shadow-md transition-all duration-200 hover:shadow-lg ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={`/${task.attachments[0].fileURL}`}
            alt={task.attachments[0].fileName}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex flex-wrap gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full hover:bg-muted">
            <EllipsisVertical size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="my-3 flex items-center justify-between">
          <h4 className="text-lg font-bold dark:text-slate-50">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {task.description}
        </p>
        <div className="mt-4 border-t border-border" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 border-background object-cover ring-2 ring-muted"
              />
            )}
            {/* {task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.author.username}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 border-background object-cover ring-2 ring-muted"
              />
            )} */}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MessageSquareMore size={18} />
            <span className="ml-1 text-sm">{numberOfComments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
