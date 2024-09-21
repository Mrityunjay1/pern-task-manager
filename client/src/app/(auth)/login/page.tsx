"use client";

import React from "react";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux";
import { useRouter } from "next/navigation";
import { login } from "@/state";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/login", values, {
        withCredentials: true,
      })
      .then((response) => {
        // Assuming the server returns user data
        const userData = response.data;

        // Dispatch the login action with the user data
        dispatch(login({ id: userData.id, username: userData.username }));

        // Handle success
        alert("Login successful!");

        // Optionally, redirect the user to a dashboard or home page
        router.push("/");
      })
      .catch((error) => {
        // Handle error
        console.error("Login error:", error);
        alert("Failed to login. Please check your credentials.");
      });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Login To Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details below to Login your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
