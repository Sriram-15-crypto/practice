// Importing necessary libraries and dependencies
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state of the userSlice
const initialState = {
  user: null,
  isLoading: true,
  error: null,
  resetMessage: "",
};

// Function to retrieve the authentication token from sessionStorage
const getToken = () => {
  return sessionStorage.getItem("authToken");
};

// Define the async thunk for user registration
export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the token

      // Ensure you have the token before making the request
      if (!token) {
        return rejectWithValue('Token is missing');
      }

      const response = await axios.post(
        'http://localhost:4008/AdminSignup', // Replace with your endpoint URL
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // Include the token in the headers
          },
        }
      );

      const { token: responseToken, message } = response.data;
      return { success: true, message, token: responseToken };
    } catch (error) {
      console.error('Error in signupUser:', error);
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('An error occurred');
      }
    }
  }
);

// Define the async thunk for user login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4008/logins', loginData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Creating the userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reducer for logging out a user
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers for handling pending, fulfilled, and rejected states of signupUser
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reducers for handling pending, fulfilled, and rejected states of loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});


// Exporting actions and reducer
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
