import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// ======== GET USER FROM LOCAL STORAGE =========
const getInitialUser = () => {
  const storedUser = localStorage.getItem("registeredUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

// ======== INITIAL STATE =========
const initialState = {
  user: getInitialUser(),
  users: JSON.parse(localStorage.getItem("registeredUsers")) || [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ======== REGISTER USER THUNK =========
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const existingUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const emailExists = existingUsers.some(
        (user) => user.email === userData.email
      );

      if (emailExists) {
        return thunkAPI.rejectWithValue("User with this email already exists.");
      }

      const newUser = {
        id: Date.now().toString(),
        fullname: userData.fullname.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password.trim(),
        createdAt: new Date().toISOString(),
        isAuthenticated: true,
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      localStorage.setItem("registeredUser", JSON.stringify(newUser));

      const userToReturn = {
        id: newUser.id, 
        fullname: newUser.fullname,
        email: newUser.email,
        createdAt: newUser.createdAt,
        isAuthenticated: true,
      };

      console.log(userToReturn);
      return userToReturn;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Registration failed");
    }
  }
);

// ======== GET USER THUNK =========
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const authUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!authUser || !authUser.isAuthenticated) {
      return thunkAPI.rejectWithValue("No authenticated user found");
    }

    const allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const completeUser = allUsers.find((user) => user.id === authUser.id);

    if (!completeUser) {
      localStorage.removeItem("registeredUser");
      return thunkAPI.rejectWithValue("User account not found");
    }

    return {
      id: completeUser.id,
      fullname: completeUser.fullname,
      email: completeUser.email,
      createdAt: completeUser.createdAt,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Get user error:", error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// ======== LOGIN USER THUNK =========
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      if (!credentials.email || !credentials.password) {
        return thunkAPI.rejectWithValue(
          "Please provide both email and password"
        );
      }

      const normalizedEmail = credentials.email.trim().toLowerCase();

      const existingUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const user = existingUsers.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      console.log(user);
      if (!user) {
        return thunkAPI.rejectWithValue("User not found. Please register.");
      }

      const authenticatedUser = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        createdAt: user.createdAt,
        isAuthenticated: true,
      };

      localStorage.setItem("registeredUser", JSON.stringify(authenticatedUser));
      console.log(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      console.error("Login error:", error);
      return thunkAPI.rejectWithValue(
        error.message || "Login failed. Please try again."
      );
    }
  }
);

// ======== LOGOUT USER THUNK =========
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const authUser = JSON.parse(localStorage.getItem("registeredUser"));

      if (authUser?.isAuthenticated) {
        const updatedUser = {
          ...authUser,
          isAuthenticated: false,
        };

        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));

        return updatedUser;
      }

      return null;
    } catch (error) {
      console.error("Logout error:", error);
      return thunkAPI.rejectWithValue(
        error.message || "Failed to complete logout. Please try again."
      );
    }
  }
);

// ======== AUTH SLICE =========
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.users.push(action.payload);
        toast.success("Registration successful!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isLoading = false;
        state.isError = false;
        toast.info("Logged out successfully.");
      });
  },
});

// ======== EXPORT =========
export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;

// "auth/register" | Meaning
// Just a label. | ✅
// Not actually an API endpoint. | ✅
// Helps Redux know what action you are handling. | ✅
// Future-proof if you later connect to a backend. | ✅
