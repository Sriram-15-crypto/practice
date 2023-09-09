import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(sessionStorage.getItem("username") || null);
  const [username1, setUsername1] = useState(sessionStorage.getItem("username1") || null);
  const [email, setEmail] = useState(sessionStorage.getItem("email") || null);
  const [dob, setDOB] = useState(sessionStorage.getItem("dob") || null);
  const [gender, setGender] = useState(sessionStorage.getItem("gender") || null);
  const [fullname, setFullname] = useState(sessionStorage.getItem("fullname") || null);
  const [createdby, setcreatedby] = useState(sessionStorage.getItem("createdby") || null);
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("authToken") || null);
  const isAuthenticated = !!authToken;
  const [sessionTimeout, setSessionTimeout] = useState(0);
  console.log("Initial username:", username);
  console.log("Initial username1:", username1);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:4008/login", {
        email,
        password,
      });

      const fetchedUsername = response.data.username;
      const fetchedUsername1 = response.data.username1;

      sessionStorage.setItem("username", fetchedUsername);
      sessionStorage.setItem("username1", fetchedUsername1);
      sessionStorage.setItem("email", response.data.email);
      sessionStorage.setItem("dob", response.data.dob);
      sessionStorage.setItem("gender", response.data.gender);
      sessionStorage.setItem("fullname", response.data.fullname);
      sessionStorage.setItem("createdby", response.data.createdby);

      const Timing = response.data.sessionTimeout;
      setSessionTimeout(Timing);

      const token = response.data.token;
      setAuthToken(token);

      setUsername(fetchedUsername);
      setUsername1(fetchedUsername1);

      // Store sessionTimeout in sessionStorage
      sessionStorage.setItem("sessionTimeout", Timing);

      sessionStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate the error to the calling component
    }
  };

  const logout = () => {
    setAuthToken(null);

    const sessionKeys = [
      "username",
      "username1",
      "email",
      "dob",
      "gender",
      "fullname",
      "createdby",
      "sessionTimeout",
      "authToken",
    ];

    sessionKeys.forEach((key) => {
      sessionStorage.removeItem(key);
    });
  };

  useEffect(() => {
    if (isAuthenticated && sessionTimeout > 0) {
      const timeout = setTimeout(() => {
        logout();
      }, sessionTimeout * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, sessionTimeout]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        username,
        username1,
        email,
        dob,
        gender,
        fullname,
        createdby,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};