import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";

const loginSchema = z.object({
  email: z.string().email(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const InstagramAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector(store=>store.auth)

  const dispatch = useDispatch()

  const navigate= useNavigate()

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
    },
  });

  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    if (isLogin) {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/user/login",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("res=====", res);
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(setAuthUser(res.data.user))
          navigate("/")
        }
        // await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.log("error===", e);
        toast.error(e.response.data.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/user/register",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("res=====", res);
        if (res.data.success) {
          toast.success(res.data.message);
          setIsLogin(true);
        }
        // await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.log("error===", e);
        toast.error(e.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-red-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Main Card */}
            <div className="bg-white p-8 border border-gray-300 rounded">
              {/* Instagram Logo */}
              <div className="flex justify-center mb-2">
                <img
                  // src="https://w7.pngwing.com/pngs/398/444/png-transparent-instagram-thumbnail.png"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGxocyFtZ6GYurUwnby1JosLo82wMEepe0XA&s" // src="/api/placeholder/150/50"
                  alt="Instagram"
                  className="h-[60px] w-[60px]"
                />
              </div>

              {isLogin ? (
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              className="bg-gray-50 border-gray-200 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              // type="password"
                              placeholder="Password"
                              className="bg-gray-50 border-gray-200 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Log in"
                      )}
                    </Button>

                    <div className="relative text-center my-4">
                      <Separator />
                      <span className="bg-white px-4 text-gray-500 text-sm relative -top-[13px]">
                        OR
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-blue-900 font-semibold flex items-center gap-2"
                    >
                      <Facebook className="w-5 h-5" />
                      Log in with Facebook
                    </Button>

                    <div className="text-center">
                      <button type="button" className="text-xs text-blue-900">
                        Forgot password?
                      </button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-gray-500 font-semibold text-lg">
                        Sign up to see photos and videos from your friends.
                      </h2>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-blue-500 hover:bg-blue-600 font-semibold flex items-center justify-center gap-2"
                    >
                      <Facebook className="w-5 h-5" />
                      Log in with Facebook
                    </Button>

                    <div className="relative text-center my-4">
                      <Separator />
                      <span className="bg-white px-4 text-gray-500 text-sm relative -top-[13px]">
                        OR
                      </span>
                    </div>

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              className="bg-gray-50 border-gray-200 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Username"
                              className="bg-gray-50 border-gray-200 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              className="bg-gray-50 border-gray-200 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <p className="text-xs text-gray-500 text-center">
                      By signing up, you agree to our Terms, Privacy Policy and
                      Cookies Policy.
                    </p>

                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Sign up"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>

            {/* Switch between Login/Signup */}
            <div className="bg-white p-6 border border-gray-300 rounded text-center">
              <p className="text-sm">
                {isLogin ? "Don't have an account? " : "Have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-500 font-semibold"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            {/* Get the app */}
            {/* <div className="text-center">
              <p className="text-sm mb-4">Get the app.</p>
              <div className="flex justify-center gap-4">
                <img
                  src="/api/placeholder/136/40"
                  alt="App Store"
                  className="h-10"
                />
                <img
                  src="/api/placeholder/136/40"
                  alt="Google Play"
                  className="h-10"
                />
              </div>
            </div> */}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InstagramAuth;
