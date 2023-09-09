import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupUser } from "../../Slice/adminSlice";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Jwt/AuthContext";

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useAuth(); // Access the authenticated user

  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
    username1: "",
    createdby: "",
  });

  const { username1, email, password, createdby } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username,
        email,
        password,
        username1,
        createdby,
      };

      const response = await dispatch(signupUser(userData));
      const { success, message } = response.payload;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username1: "",
      username: "",
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card style={{ maxWidth: 400, padding: "16px" }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Admin Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            
          <TextField
              fullWidth
              label="Username"
              type="text"
              value={username1}
              name="username1"
              placeholder="Enter your username"
              onChange={handleOnChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="created By"
              type="text"
              name="username"
              value={username}
              placeholder="Enter the created by username"
              onChange={handleOnChange}
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button>
            <Box mt={2}>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Go back</Button>
              </Link>
            </Box>
          </form>
          <ToastContainer />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUser;
