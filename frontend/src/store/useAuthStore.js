import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,


    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        } catch (error) {
            set({authUser:null})
            console.log(error)   
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
      
          // Ensure connectSocket exists before calling it
          get().connectSocket?.();
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
          set({ isSigningUp: false });
        }
      },
      
      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
      
          if (!res.data) {
            throw new Error("Invalid response from server");
          }
      
          set({ authUser: res.data });
      
          // Store token in local storage (if using JWT)
          if (res.data.token) {
            localStorage.setItem("authToken", res.data.token);
          }
      
          toast.success("Logged in successfully");
      
          // Connect WebSocket (if applicable)
          get().connectSocket();
        } catch (error) {
          console.error("Login error:", error);
          toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
          set({ isLoggingIn: false });
        }
      },
      
    
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    
      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.error("Error updating profile:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
      
    
}))