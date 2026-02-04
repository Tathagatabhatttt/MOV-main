import { create } from "zustand";

export const useWaitlistStore = create(set => ({
  users: [
    { name: "Arjun", city: "Bangalore" },
    { name: "Sneha", city: "Chennai" },
    { name: "Rahul", city: "Delhi" }
  ],
  addUser: user =>
    set(state => ({ users: [...state.users, user] }))
}));
