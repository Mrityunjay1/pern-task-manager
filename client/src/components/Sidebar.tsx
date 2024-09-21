import * as React from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  User,
  Settings,
  X,
  Briefcase,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";
import { useGetProjectsQuery } from "@/state/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    // { href: "/timeline", label: "Timeline", icon: Briefcase },
    // { href: "/search", label: "Search", icon: Search },
    // { href: "/users", label: "Users", icon: User },
    // { href: "/settings", label: "Settings", icon: Settings },
    // { href: "/teams", label: "Teams", icon: Users }, // Replace with actual logout action or link
  ];

  const { data: projects } = useGetProjectsQuery();

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-pink-50 p-4 transition-transform duration-300 ease-in-out dark:bg-slate-800 dark:text-white md:static md:translate-x-0`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <div className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          );
        })}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="projects">
            <AccordionTrigger className="py-2">
              <div className="flex items-center pl-4">
                <Briefcase className="mr-2 h-4 w-4" />
                Projects
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-6 space-y-1">
                {projects?.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    passHref
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        pathname === `/projects/${project.id}`
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      {project.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
}
