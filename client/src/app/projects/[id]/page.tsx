"use client";
import React, { useState } from "react";
import ProjectHeader from "../ProjectHeader";

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      <ProjectHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        isModalNewTaskOpen={isModalNewTaskOpen}
        projectId={id}
      />
    </div>
  );
};

export default Project;
