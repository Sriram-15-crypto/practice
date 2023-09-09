// Importing the CSS file for styling.
import "./App.css";

// Importing various components and routing utilities from 'react-router-dom' library.
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import AdminPage from "./Components/admindashboads/admin";
import ForgotPassword from "./Components/Forgot/Forgotpassword";
import SignIn from "./Components/Signup/Signin";
import ResetPasswordPage from "./Components/Forgot/resetpassword";
import PrivateRoute from "./Components/Jwt/privateRoute";
import SignupList from "./Components/Signup/SignupList";
import AddUser from "./Components/admindashboads/Addnewuser";
import UserProfile from "./Components/admindashboads/UserProfile";

function App() {
  // The main component for the application.
  return (
    <>
      {/* Setting up routes for the application */}
      <Routes>
        {/* Route for the home page */}
        <Route exact path="/" element={<Home />} />

        {/* Route for the signup page */}
        <Route path="/signup" element={<Signup />} />

        {/* Route for the signin page */}
        <Route path="/signin" element={<SignIn />} />

        {/* Route for the forgot password page */}
        <Route path="/FORGOTPASSWORD" element={<ForgotPassword />} />

        {/* Route for resetting password with a token */}
        <Route path="/RESETPASSWORD/:token" element={<ResetPasswordPage />} />

        {/* Route for listing signups */}
        <Route path="/SignupList" element={<SignupList />} />

        {/* Route for adding a new user, protected by PrivateRoute */}
        <Route path="/adduser" element={<PrivateRoute><AddUser /></PrivateRoute>} />

        {/* Route for viewing user profile, protected by PrivateRoute */}
        <Route path="/Profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />

        {/* Route for the admin dashboard, protected by PrivateRoute */}
        <Route path="/dashboard" element={<PrivateRoute>  <AdminPage /></PrivateRoute>}
        />
      </Routes>
    </>
  );
}

// Exporting the App component as the default export.
export default App;
