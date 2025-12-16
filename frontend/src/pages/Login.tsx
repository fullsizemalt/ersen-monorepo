import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, ArrowRight, Shield, Globe } from 'lucide-react';

const Login: React.FC = () => {
    const { login, localDevBypass } = useAuth();
    const navigate = useNavigate();

    const handleDemoMode = () => {
        localDevBypass();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black selection:bg-white/20">
            {/* Ambient Background */}
            <div className="absolute inset-0 w-full h-full bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="w-full max-w-sm p-6 relative z-10 animate-fade-in-up">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)]">
                        <Zap className="w-6 h-6 text-black" fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">
                        Ersen
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-wide">
                        Personal Operating System
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => login('google')}
                        className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 text-sm font-medium text-zinc-300 hover:text-white"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                        Continue with Google
                    </button>

                    <button
                        onClick={() => login('github')}
                        className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 text-sm font-medium text-zinc-300 hover:text-white"
                    >
                        <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-4 h-4 invert opacity-90" />
                        Continue with GitHub
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-900"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-medium">
                            <span className="bg-black px-3 text-zinc-700">or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDemoMode}
                        className="w-full h-11 bg-white hover:bg-zinc-200 text-black rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm font-medium hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Try Demo Mode <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-[10px] text-zinc-700 text-center pt-2">
                        Demo mode uses local mock data. No backend required.
                    </p>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6 text-[10px] uppercase tracking-wider text-zinc-700 font-medium">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        <span>Private</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        <span>Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span>Open</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
