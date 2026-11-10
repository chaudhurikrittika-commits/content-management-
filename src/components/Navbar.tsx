import React from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Users,
  Plus,
  Sparkles,
  BarChart3,
  Calendar,
  Briefcase,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, PlatformAccount } from '../types/index.ts';

interface NavbarProps {
  activeTab: 'dashboard' | 'calendar' | 'collabs' | 'ai-strategy' | 'security';
  onTabChange: (tab: 'dashboard' | 'calendar' | 'collabs' | 'ai-strategy' | 'security') => void;
  currentUser: UserProfile;
  teamProfiles: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  isVaultUnlocked: boolean;
  onOpenVaultModal: () => void;
  onOpenCreatePost: () => void;
  platformAccounts: PlatformAccount[];
  onOpenAccountsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  teamProfiles,
  onSwitchUser,
  isVaultUnlocked,
  onOpenVaultModal,
  onOpenCreatePost,
  platformAccounts,
  onOpenAccountsModal
}) => {
  const connectedCount = platformAccounts.filter((p) => p.connected).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Workspace Indicator */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-xs text-white font-bold text-base sm:text-lg flex-shrink-0">
                Ω
              </div>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base block leading-tight">
                  OmniVibe Studio
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500 font-normal">
                  Multi-Platform & E2EE Vault
                </span>
              </div>
            </div>

            {/* Platform connection quick pill */}
            <button
              onClick={onOpenAccountsModal}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              title="Manage connected social accounts"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{connectedCount} Accounts Active</span>
              <span className="text-slate-400">·</span>
              <span className="text-indigo-600 font-medium">Manage</span>
            </button>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Feeds</span>
            </button>

            <button
              onClick={() => onTabChange('calendar')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Content Calendar</span>
            </button>

            <button
              onClick={() => onTabChange('collabs')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'collabs'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Collabs & Deals</span>
            </button>

            <button
              onClick={() => onTabChange('ai-strategy')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'ai-strategy'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Strategy Lab</span>
            </button>

            <button
              onClick={() => onTabChange('security')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security & MFA</span>
            </button>
          </nav>

          {/* Right Action Tools: E2EE Vault, User Switcher, Create Post */}
          <div className="flex items-center gap-2.5">
            {/* E2EE Vault Lock/Unlock Button */}
            <button
              onClick={onOpenVaultModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isVaultUnlocked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Client-side AES-256-GCM Vault Status"
            >
              {isVaultUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">E2EE Vault Open</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">E2EE Locked</span>
                </>
              )}
            </button>

            {/* User Profile Switcher */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
                title={`Active user: ${currentUser.name} (${currentUser.role})`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
                <div className="hidden xl:block text-left text-xs leading-none">
                  <div className="font-semibold text-slate-900">{currentUser.name.split(' ')[0]}</div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </button>

              {/* Dropdown switch menu */}
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 hidden group-hover:block hover:block z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Switch Active Role (RBAC)
                </div>
                {teamProfiles.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => onSwitchUser(user)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors ${
                      user.id === currentUser.id ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</div>
                      </div>
                    </div>
                    {user.id === currentUser.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Post Action Button */}
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-100">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onTabChange('calendar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'calendar' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => onTabChange('collabs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'collabs' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Collabs
          </button>
          <button
            onClick={() => onTabChange('ai-strategy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'ai-strategy' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            AI Strategy
          </button>
          <button
            onClick={() => onTabChange('security')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'security' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Security
          </button>
        </div>
      </div>
    </header>
  );
};
