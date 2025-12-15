import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import Layout from './Layout';

const PrivateRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return user ? (
        <Layout>
            <Outlet />
        </Layout>
    ) : <Navigate to="/login" />;
};

export default PrivateRoute;
