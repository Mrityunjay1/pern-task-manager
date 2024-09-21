import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            TaskMaster
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 dark:text-white md:text-6xl">
            Manage Tasks with Ease
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Boost your productivity and streamline your workflow
          </p>
          <div>
            <Link href="/projects/1">
              <Button
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CheckCircle,
              title: "Task Organization",
              description: "Easily organize and prioritize your tasks",
            },
            {
              icon: Clock,
              title: "Time Tracking",
              description: "Track time spent on tasks and projects",
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Collaborate seamlessly with your team",
            },
            {
              icon: Zap,
              title: "Productivity Boost",
              description: "Increase your productivity with smart features",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
            >
              <feature.icon className="mb-4 h-12 w-12 text-purple-600 dark:text-purple-400" />
              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                {feature.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-16 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Join thousands of users who are already boosting their productivity
          </p>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2023 TaskMaster. All rights reserved.</p>
      </footer>
    </div>
    // </main>
  );
}
