import React from 'react';
import { motion } from 'motion/react';
import { Wrench, RefreshCw, LogIn, LogOut, Trophy } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface MaintenanceProps {
  onRefresh?: () => void;
}

export default function Maintenance({ onRefresh }: MaintenanceProps) {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#5ac9b7]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-md w-full bg-[#12121A] border border-white/5 rounded-2xl p-8 text-center shadow-2xl relative z-10"
      >
        {/* App Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2.5 bg-[#5ac9b7]/10 rounded-xl border border-[#5ac9b7]/20">
            <Trophy className="w-6 h-6 text-[#5ac9b7]" />
          </div>
          <span className="font-sans font-black tracking-widest text-xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            REMIX W8
          </span>
        </div>

        {/* Animated Construction Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#5ac9b7]/30"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 flex items-center justify-center shadow-lg"
          >
            <Wrench className="w-8 h-8 text-[#5ac9b7]" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-3">
          Under Maintenance
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          We're currently performing scheduled server upgrades to improve your gaming experience. We should be back online shortly!
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full bg-[#5ac9b7] hover:bg-[#4bb9a8] text-[#0B0B0F] font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#5ac9b7]/10 hover:shadow-[#5ac9b7]/20 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4 transition-transform hover:rotate-180 duration-500" />
            Check Status
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#1C1C26] hover:bg-[#252533] text-gray-300 font-medium py-2.5 px-3 rounded-lg text-xs transition duration-200 border border-white/5 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5" />
              Admin Login
            </button>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="bg-[#1C1C26] hover:bg-[#ef4444]/10 hover:text-red-400 text-gray-400 font-medium py-2.5 px-3 rounded-lg text-xs transition duration-200 border border-white/5 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="bg-[#1C1C26] hover:bg-[#252533] text-gray-300 font-medium py-2.5 px-3 rounded-lg text-xs transition duration-200 border border-white/5 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
