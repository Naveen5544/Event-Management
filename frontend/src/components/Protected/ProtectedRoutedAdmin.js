import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRouteAdmin({ children }) {
    const { user } = useAuth();

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

ProtectedRouteAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRouteAdmin;