import { Tasks, useGetTasksQuery } from "@/state/api";
import React, { useState } from "react";

import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";

type ListProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: ListProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [sortCriteria, setSortCriteria] = useState<string>("dueDate");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error retrieving tasks</div>;

  // Sorting function
  const sortTasks = (tasks: Tasks[]) => {
    switch (sortCriteria) {
      case "status":
        return [...tasks].sort((a, b) => a.status!.localeCompare(b.status!));
      // case "priority":
      //   return [...tasks].sort(
      //     (a, b) => (a.priority! ?? 0) - (b.priority ?? 0),
      //   );
      case "dueDate":
        return [...tasks].sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        });
      default:
        return tasks;
    }
  };

  const sortedTasks = sortTasks(tasks || []); // Ensure tasks is always an array
  const handleSortChange = (criteria: string) => {
    setSortCriteria(criteria);
  };

  return (
    <div className="px-4 pb-8 dark:text-white xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <Button onClick={() => setIsModalNewTaskOpen(true)}>
              Create New Task
            </Button>
          }
          isSmallText
        />
      </div>

      {/* Sorting Controls */}
      <div className="mb-4 flex justify-end">
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          value={sortCriteria}
          className="rounded border p-2"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="status">Sort by Status</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {sortedTasks?.map((task: Tasks) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
