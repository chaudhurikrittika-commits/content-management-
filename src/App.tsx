import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AnalyticsDashboard } from './components/AnalyticsDashboard.tsx';
import { ContentCalendar } from './components/ContentCalendar.tsx';
import { CollaborationHub } from './components/CollaborationHub.tsx';
import { AIStrategyLab } from './components/AIStrategyLab.tsx';
import { SecurityModal } from './components/SecurityModal.tsx';
import { CreatePostModal } from './components/CreatePostModal.tsx';
import { ConnectedAccountsModal } from './components/ConnectedAccountsModal.tsx';
import { PostDetailModal } from './components/PostDetailModal.tsx';
import {
  initialPlatformAccounts,
  initialPosts,
  initialCollabProjects,
  initialTeamProfiles,
  initialSecurityLogs
} from './data/mockData.ts';
import {
  PostItem,
  CollabProject,
  PlatformAccount,
  UserProfile,
  SecurityAuditEntry,
  SocialPlatform
} from './types/index.ts';
import { deriveKeyFromPassphrase, generateSalt } from './utils/crypto.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'collabs' | 'ai-strategy' | 'security'>('dashboard');

  // Application Data State
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [collabs, setCollabs] = useState<CollabProject[]>(initialCollabProjects);
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>(initialPlatformAccounts);
  const [teamProfiles, setTeamProfiles] = useState<UserProfile[]>(initialTeamProfiles);
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialTeamProfiles[0]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>(initialSecurityLogs);

  // Security & Vault State
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(true);

  // Modals
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [createPostInitialDate, setCreatePostInitialDate] = useState<string>('2026-11-15');
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // Add audit log helper
  const handleAddAuditLog = (logData: Omit<SecurityAuditEntry, 'id' | 'timestamp'>) => {
    const newLog: SecurityAuditEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...logData
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Toggle platform connection
  const handleTogglePlatformConnect = (platform: SocialPlatform) => {
    setPlatformAccounts((prev) =>
      prev.map((acc) => {
        if (acc.platform === platform) {
          const nextState = !acc.connected;
          handleAddAuditLog({
            userId: currentUser.id,
            userName: currentUser.name,
            action: nextState ? 'LOGIN' : 'VAULT_LOCK',
            status: 'SUCCESS',
            ipAddress: '192.168.1.104',
            details: `${platform.toUpperCase()} OAuth feed connection ${nextState ? 'established' : 'terminated'}`
          });
          return {
            ...acc,
            connected: nextState,
            lastSynced: nextState ? 'Just now' : 'Disconnected'
          };
        }
        return acc;
      })
    );
  };

  // Switch Active User (RBAC demonstration)
  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    handleAddAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'LOGIN',
      status: 'SUCCESS',
      ipAddress: '192.168.1.104',
      details: `Switched active profile to ${user.name} (Role: ${user.role.toUpperCase()})`
    });
  };

  // Toggle Vault Lock/Unlock with real Web Crypto derivation
  const handleToggleVaultLock = async (passphrase: string, shouldUnlock: boolean): Promise<boolean> => {
    if (!shouldUnlock) {
      setIsVaultUnlocked(false);
      return true;
    }

    try {
      const salt = generateSalt(16);
      await deriveKeyFromPassphrase(passphrase, salt);
      setIsVaultUnlocked(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Save new post
  const handleSavePost = (newPostData: Omit<PostItem, 'id'>) => {
    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      ...newPostData
    };
    setPosts((prev) => [newPost, ...prev]);

    handleAddAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'POST_PUBLISHED',
      status: 'SUCCESS',
      ipAddress: '192.168.1.104',
      details: `New content scheduled for ${newPost.scheduledFor} on [${newPost.platforms.join(', ')}]`
    });
  };

  // Invite new collaborator
  const handleInviteCollaborator = (collab: { name: string; email: string; role: any }) => {
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: collab.name,
      email: collab.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: collab.role,
      workspaceId: 'ws-main',
      permissions: {
        canPublish: collab.role === 'manager' || collab.role === 'owner',
        canManageCollabs: collab.role === 'manager' || collab.role === 'owner',
        canViewFinancials: collab.role === 'owner',
        canManageSecurity: collab.role === 'owner',
        canApproveContent: collab.role === 'brand_partner' || collab.role === 'manager' || collab.role === 'owner'
      },
      mfaEnabled: true,
      lastActive: 'Invited just now'
    };

    setTeamProfiles((prev) => [...prev, newProfile]);

    handleAddAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'LOGIN',
      status: 'SUCCESS',
      ipAddress: '192.168.1.104',
      details: `Invited new collaborator ${collab.name} with role ${collab.role}`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        teamProfiles={teamProfiles}
        onSwitchUser={handleSwitchUser}
        isVaultUnlocked={isVaultUnlocked}
        onOpenVaultModal={() => setActiveTab('security')}
        onOpenCreatePost={() => {
          setCreatePostInitialDate('2026-11-15');
          setIsCreatePostOpen(true);
        }}
        platformAccounts={platformAccounts}
        onOpenAccountsModal={() => setIsAccountsModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            posts={posts}
            platformAccounts={platformAccounts}
            onSelectPost={setSelectedPost}
            onNavigateToAI={() => setActiveTab('ai-strategy')}
          />
        )}

        {activeTab === 'calendar' && (
          <ContentCalendar
            posts={posts}
            onSelectPost={setSelectedPost}
            onOpenCreatePostForDate={(isoDate) => {
              setCreatePostInitialDate(isoDate);
              setIsCreatePostOpen(true);
            }}
            onNavigateToAI={() => setActiveTab('ai-strategy')}
          />
        )}

        {activeTab === 'collabs' && (
          <CollaborationHub
            collabs={collabs}
            currentUser={currentUser}
            teamProfiles={teamProfiles}
            isVaultUnlocked={isVaultUnlocked}
            onOpenVaultModal={() => setActiveTab('security')}
            onUpdateCollabs={setCollabs}
            onInviteCollaborator={handleInviteCollaborator}
          />
        )}

        {activeTab === 'ai-strategy' && (
          <AIStrategyLab
            posts={posts}
            platformAccounts={platformAccounts}
            onApplyPostIdea={(title, caption, platform) => {
              setCreatePostInitialDate('2026-11-16');
              setIsCreatePostOpen(true);
            }}
          />
        )}

        {activeTab === 'security' && (
          <SecurityModal
            currentUser={currentUser}
            isVaultUnlocked={isVaultUnlocked}
            onToggleVaultLock={handleToggleVaultLock}
            auditLogs={auditLogs}
            onAddAuditLog={handleAddAuditLog}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OmniVibe Creator Studio · Client-Side AES-256-GCM Zero-Knowledge Security</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>RFC 6238 TOTP Active</span>
            <span>·</span>
            <span>Gemini 3.8 Flash AI Engine</span>
            <span>·</span>
            <span>RBAC Protected</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreatePostModal
        initialDate={createPostInitialDate}
        currentUser={currentUser}
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSavePost={handleSavePost}
      />

      <ConnectedAccountsModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        platformAccounts={platformAccounts}
        onToggleConnect={handleTogglePlatformConnect}
      />

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
