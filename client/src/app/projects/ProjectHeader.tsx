import React from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Grid3X3, List, Search, Share2 } from "lucide-react";
import BoardView from "./BoardView";
import ListView from "./ListView";
import { CreateTaskModal } from "@/components/ModalNewTask";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  isModalNewTaskOpen: boolean;
  projectId: string;
};

const ProjectHeader = ({
  activeTab,
  setActiveTab,
  projectId,
  setIsModalNewTaskOpen,
  isModalNewTaskOpen,
}: Props) => {
  return (
    <div className="px-4 xl:px-6">
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header name="Project" />
      </div>

      <div className="dark:border-stroke-dark flex flex-wrap-reverse justify-between gap-2 pb-[8px] pt-2 md:items-center">
        <TabButton activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:bg-neutral-950 dark:hover:text-gray-300">
            <Filter className="h-4 w-4" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:bg-neutral-950 dark:hover:text-gray-300">
            <Share2 className="h-4 w-4" />
          </button>
          <div className="relative w-full max-w-md rounded-md border border-black text-muted-foreground">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              type="search"
              placeholder="Search Tasks"
              className="w-full pl-8"
            />
          </div>
        </div>
      </div>

      {activeTab === "board" ? (
        <BoardView
          id={projectId}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      ) : (
        <ListView
          id={projectId}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      )}
      <CreateTaskModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        projectId={Number(projectId)}
      />
    </div>
  );
};

const TabButton = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="board">
          <Grid3X3 className="mr-2 h-4 w-4" />
          Board
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="mr-2 h-4 w-4" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProjectHeader;
