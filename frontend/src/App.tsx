import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TimerProvider } from './contexts/TimerContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Onboarding from './pages/Onboarding';
import AdminDashboard from './pages/AdminDashboard';
import CLIAccess from './pages/CLIAccess';
import DemoGallery from './pages/DemoGallery';
import PrivateRoute from './components/layout/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

import GuestDashboard from './pages/GuestDashboard';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <TimerProvider>
                <AuthProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<GuestDashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/legal/terms" element={<Terms />} />
                            <Route path="/legal/privacy" element={<Privacy />} />
                            <Route path="/demos" element={
                                <ErrorBoundary>
                                    <DemoGallery />
                                </ErrorBoundary>
                            } />

                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/onboarding" element={<Onboarding />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/cli" element={<CLIAccess />} />
                                <Route path="/gallery" element={
                                    <ErrorBoundary>
                                        <DemoGallery />
                                    </ErrorBoundary>
                                } />
                            </Route>


                        </Routes>
                    </Router>
                </AuthProvider>
            </TimerProvider>
        </ThemeProvider>
    );
};

export default App;
