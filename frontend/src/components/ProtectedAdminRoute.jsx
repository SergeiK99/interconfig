import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute; 