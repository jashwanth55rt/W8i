import React, { useState } from 'react';
import { ArrowLeft, UserCircle, Mail, Hash, Globe, Edit2, X, Check, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export default function MyProfile() {
  const { dbUser, user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    username: '',
    photoURL: '',
    country: '',
    phone: ''
  });

  const handleEditClick = () => {
    setEditForm({
      username: dbUser?.username || '',
      photoURL: dbUser?.photoURL || user?.photoURL || '',
      country: dbUser?.country || '',
      phone: dbUser?.phone || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username: editForm.username,
        photoURL: editForm.photoURL,
        country: editForm.country,
        phone: editForm.phone,
        updatedAt: new Date()
      });
      toast.success('Profile updated successfully!');
      // Update local state temporarily if needed, though onSnapshot or reload might be better.
      // But we use AuthContext, so wait for auth context to re-trigger, or just close and let user reload. 
      // Actually AuthContext doesn't use onSnapshot, it uses getDoc once onAuthStateChanged.
      // So dbUser won't update immediately unless we refresh or update context.
      // Easiest is to reload page if we want to show changes without context refactoring.
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans pb-20 relative">
      <header className="flex items-center justify-between px-4 py-3 bg-[#12182F] sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <button aria-label="Back" className="text-white p-1 -ml-1 hover:bg-white/10 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-semibold text-lg tracking-wide">User Identity</h1>
        </div>
        {!isEditing && (
          <button 
            onClick={handleEditClick}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </header>

      <div className="flex flex-col px-4 pt-6 max-w-[500px] mx-auto w-full">
        <div className="flex items-center justify-center mb-8 relative">
           <div className="w-[120px] h-[120px] rounded-full border-[3px] border-[#3B82F6] overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.4)] relative group">
             {dbUser?.photoURL || user?.photoURL ? (
               <img src={dbUser?.photoURL || user?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <img 
                 src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${dbUser?.username || user?.uid || 'user'}`} 
                 alt="Profile" 
                 className="w-full h-full object-cover bg-gradient-to-br from-blue-900 to-black"
               />
             )}
             {isEditing && (
               <div className="absolute inset-x-0 bottom-0 top-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm pointer-events-none">
                 <Camera className="w-8 h-8 mb-1 opacity-80" />
                 <span className="text-[10px] font-bold text-center px-2">Edit URL in form</span>
               </div>
             )}
           </div>
        </div>

        <div className="bg-[#1A0B2E] rounded-xl overflow-hidden border border-white/5 divide-y divide-white/5 shadow-lg">
          <div className="px-4 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white/60 text-[12px] font-medium mb-0.5">Username / Gamer tag</p>
              <p className="text-white font-bold text-[15px] truncate">{dbUser?.username || 'Not set'}</p>
            </div>
          </div>

          <div className="px-4 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white/60 text-[12px] font-medium mb-0.5">Email / Mobile number</p>
              <p className="text-white font-bold text-[15px] truncate">{user?.email || dbUser?.phone || 'Not set'}</p>
            </div>
          </div>

          <div className="px-4 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
              <Hash className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white/60 text-[12px] font-medium mb-0.5">User ID</p>
              <p className="text-white font-mono text-[13px] truncate">{user?.uid}</p>
            </div>
          </div>

          <div className="px-4 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white/60 text-[12px] font-medium mb-0.5">Country / Region</p>
              <p className="text-white font-bold text-[15px] truncate">{dbUser?.country || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C093B] w-full max-w-[500px] sm:rounded-2xl rounded-t-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/20">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                disabled={saving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[13px] text-gray-300 font-medium ml-1">Username</label>
                <input 
                  type="text" 
                  value={editForm.username} 
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  placeholder="Enter username"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-300 font-medium ml-1">Profile Photo URL</label>
                <input 
                  type="text" 
                  value={editForm.photoURL} 
                  onChange={(e) => setEditForm({...editForm, photoURL: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-300 font-medium ml-1">Mobile Number (Optional)</label>
                <input 
                  type="tel" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-300 font-medium ml-1">Country / Region</label>
                <input 
                  type="text" 
                  value={editForm.country} 
                  onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  placeholder="e.g. India, USA"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 mt-auto">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
