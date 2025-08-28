"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { loginSchema } from "./login-schema";
const LoginFormFields = ({ onSubmit, isSubmitting }) => {
  // Initialize form
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to clean URL parameters when form is submitted
  const handleFormSubmit = (data) => {
    // Clean the URL to just /login without any error parameters
    // This ensures future logins have a clean URL
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname; // Just the path, no query params
      window.history.replaceState({}, '', cleanUrl);
    }
    
    // Call the original onSubmit function
    onSubmit(data);
  };

  // Function to clean URL parameters when user starts interacting with form
  const cleanUrlOnInteraction = () => {
    // Clean the URL when user starts typing or interacting with the form
    // This provides immediate feedback that the error state is being cleared
    if (window.history && window.history.replaceState && window.location.search) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  {...field} 
                  onFocus={cleanUrlOnInteraction}
                  onChange={(e) => {
                    field.onChange(e);
                    cleanUrlOnInteraction();
                  }}
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
                  placeholder="••••••••" 
                  {...field} 
                  onFocus={cleanUrlOnInteraction}
                  onChange={(e) => {
                    field.onChange(e);
                    cleanUrlOnInteraction();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Logging in...{" "}
            </span>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginFormFields;
