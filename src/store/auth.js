import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("registeredUser")) || null, //initial state of the user, either fetch from local storage or return null if there's none
  
  login: (userData) => {
    const sessionExpiry = Date.now() + 1000 * 60 * 5; //5 minutes
    const payload = { ...userData, sessionExpiry }; //merge the user data with the session expiry
    localStorage.setItem("registeredUser", JSON.stringify(payload)); //store the user data in local storage
    set({ user: payload }); //update the user state using zustand "set({})"
  },
  logout: () => {
    // localStorage.removeItem("registeredUser"); bug to be fixed later
    set({ user: null });
  },
}));

export default useAuthStore;
