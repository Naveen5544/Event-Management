import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();
    
    if (!isLoggedIn) {
        // Redirect them to the / page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login.
        return <Navigate to="/" replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;