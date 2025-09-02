import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import CreateSurvey from "./pages/CreateSurvey.jsx";
import DeploySurvey from "./pages/DeploySurvey.jsx";
import Approve from "./pages/Approve.jsx"
import ApproveTable from "./pages/ApproveTable.jsx";

// Temporary authentication check function
const isAuthenticated = () => {
    return localStorage.getItem("token") !== null; // Example: check token
};

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected/Admin routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="create-survey" element={<CreateSurvey />} />
                    <Route path="deploy-survey" element={<DeploySurvey />} />
                    <Route path="approve-request" element={<Approve/>}/>
                    <Route path="approve-table" element={<ApproveTable/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
