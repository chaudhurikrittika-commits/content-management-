import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  MessageSquare,
  Lock,
  Unlock,
  ShieldCheck,
  Send,
  Calendar,
  AlertCircle,
  FileText,
  UserPlus,
  Tag,
  Filter
} from 'lucide-react';
import { CollabProject, CollabApprovalStatus, CollabType, UserProfile, SocialPlatform } from '../types/index.ts';
import { calculateCollabFinancials } from '../utils/analytics.ts';
import { maskSensitiveValue } from '../utils/crypto.ts';

interface CollaborationHubProps {
  collabs: CollabProject[];
  currentUser: UserProfile;
  teamProfiles: UserProfile[];
  isVaultUnlocked: boolean;
  onOpenVaultModal: () => void;
  onUpdateCollabs: (collabs: CollabProject[]) => void;
  onInviteCollaborator: (collaborator: { name: string; email: string; role: any }) => void;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  collabs,
  currentUser,
  teamProfiles,
  isVaultUnlocked,
  onOpenVaultModal,
  onUpdateCollabs,
  onInviteCollaborator
}) => {
  const [selectedCollabId, setSelectedCollabId] = useState<string>(collabs[0]?.id || '');
  const [typeFilter, setTypeFilter] = useState<CollabType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CollabApprovalStatus | 'all'>('all');

  // Modals state
  const [isNewCollabOpen, setIsNewCollabOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // New collab form
  const [newTitle, setNewTitle] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandContact, setNewBrandContact] = useState('');
  const [newDealValue, setNewDealValue] = useState<number>(3500);
  const [newCollabType, setNewCollabType] = useState<CollabType>('paid_sponsorship');
  const [newCategory, setNewCategory] = useState('Tech & Software');

  // Invite form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'creator' | 'brand_partner'>('brand_partner');

  // New comment input
  const [newCommentText, setNewCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  // New task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(currentUser.id);
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-11-20');

  // Financial aggregates
  const financials = calculateCollabFinancials(collabs);

  // Filtered collabs
  const filteredCollabs = collabs.filter((c) => {
    // Data segregation: brand partners can only view projects they are explicitly invited to!
    if (currentUser.role === 'brand_partner' && !c.collaboratorIds.includes(currentUser.id)) {
      return false;
    }
    if (typeFilter !== 'all' && c.collabType !== typeFilter) return false;
    if (statusFilter !== 'all' && c.approvalStatus !== statusFilter) return false;
    return true;
  });

  const activeCollab = collabs.find((c) => c.id === selectedCollabId) || filteredCollabs[0];

  // Helper to toggle deliverable completion
  const handleToggleDeliverable = (delId: string) => {
    if (!activeCollab) return;
    const updated = collabs.map((c) => {
      if (c.id !== activeCollab.id) return c;
      return {
        ...c,
        deliverables: c.deliverables.map((d) => (d.id === delId ? { ...d, completed: !d.completed } : d))
      };
    });
    onUpdateCollabs(updated);
  };

  // Helper to toggle task completion
  const handleToggleTask = (taskId: string) => {
    if (!activeCollab) return;
    const updated = collabs.map((c) => {
      if (c.id !== activeCollab.id) return c;
      return {
        ...c,
        tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      };
    });
    onUpdateCollabs(updated);
  };

  // Helper to advance approval status
  const handleAdvanceStatus = (nextStatus: CollabApprovalStatus) => {
    if (!activeCollab) return;
    const updated = collabs.map((c) => (c.id === activeCollab.id ? { ...c, approvalStatus: nextStatus } : c));
    onUpdateCollabs(updated);
  };

  // Helper to add new comment
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCollab) return;

    const newComment = {
      id: `cmt-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role.replace('_', ' ').toUpperCase(),
      timestamp: 'Just now',
      text: newCommentText.trim(),
      isInternalOnly: isInternalComment
    };

    const updated = collabs.map((c) => {
      if (c.id !== activeCollab.id) return c;
      return {
        ...c,
        comments: [...c.comments, newComment]
      };
    });

    onUpdateCollabs(updated);
    setNewCommentText('');
  };

  // Helper to add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeCollab) return;

    const assignedUser = teamProfiles.find((u) => u.id === newTaskAssigneeId) || currentUser;

    const newTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignedToUserId: assignedUser.id,
      assignedToName: assignedUser.name,
      assignedToAvatar: assignedUser.avatar,
      dueDate: newTaskDueDate,
      completed: false,
      priority: 'medium' as const
    };

    const updated = collabs.map((c) => {
      if (c.id !== activeCollab.id) return c;
      return {
        ...c,
        tasks: [...c.tasks, newTask]
      };
    });

    onUpdateCollabs(updated);
    setNewTaskTitle('');
  };

  // Handle create new collab
  const handleCreateCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBrandName.trim()) return;

    const newCollab: CollabProject = {
      id: `collab-${Date.now()}`,
      title: newTitle.trim(),
      brandName: newBrandName.trim(),
      brandContact: newBrandContact.trim(),
      dealValue: newCollabType === 'organic_collab' ? 0 : Number(newDealValue) || 0,
      currency: 'USD',
      collabType: newCollabType,
      isPaid: false,
      approvalStatus: 'concept_review',
      deliverables: [
        {
          id: `del-${Date.now()}-1`,
          title: 'Primary Campaign Video / Reel',
          platform: 'instagram',
          mediaType: 'reel',
          completed: false,
          dueDate: '2026-11-25'
        }
      ],
      tasks: [],
      comments: [
        {
          id: `cmt-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorRole: currentUser.role.toUpperCase(),
          timestamp: 'Just now',
          text: 'Project initiated and added to collaborative workspace.',
          isInternalOnly: false
        }
      ],
      collaboratorIds: [currentUser.id],
      contractTerms: 'Standard sponsorship agreement, FTC disclosure required.',
      ftcDisclosureRequired: newCollabType === 'paid_sponsorship',
      ftcTags: newCollabType === 'paid_sponsorship' ? ['#ad', '#sponsored'] : ['#collab'],
      targetReach: 50000,
      category: newCategory,
      updatedAt: new Date().toISOString()
    };

    onUpdateCollabs([newCollab, ...collabs]);
    setSelectedCollabId(newCollab.id);
    setIsNewCollabOpen(false);
    setNewTitle('');
    setNewBrandName('');
  };

  // Status progression stages
  const stages: { key: CollabApprovalStatus; label: string }[] = [
    { key: 'concept_review', label: 'Concept Review' },
    { key: 'script_approved', label: 'Script Approved' },
    { key: 'draft_review', label: 'Draft Review' },
    { key: 'brand_approved', label: 'Brand Approved' },
    { key: 'ready_to_publish', label: 'Ready to Publish' },
    { key: 'published', label: 'Published' }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Financials */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Collaborations & Sponsorships CRM</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage organic partnerships and paid sponsor campaigns with role-based workflow, task segregation & E2EE protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Collaborator</span>
          </button>

          <button
            onClick={() => setIsNewCollabOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collab Deal</span>
          </button>
        </div>
      </div>

      {/* Financial Pipeline Overview with E2EE Protection */}
      {currentUser.permissions.canViewFinancials ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Total Deal Pipeline</span>
              {isVaultUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              )}
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {isVaultUnlocked ? `$${financials.totalPipelineValue.toLocaleString()}` : maskSensitiveValue(financials.totalPipelineValue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across {financials.totalDeals} active partner campaigns
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Received Earnings</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-emerald-600">
              {isVaultUnlocked ? `$${financials.paidEarnings.toLocaleString()}` : maskSensitiveValue(financials.paidEarnings)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {financials.paidDealsCount} finalized payouts
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Under Review Pipeline</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {isVaultUnlocked ? `$${financials.inReviewValue.toLocaleString()}` : maskSensitiveValue(financials.inReviewValue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Pending final brand sign-off
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Deliverables Pending</span>
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {financials.pendingDeliverablesCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across reels, stories & shorts
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Financial figures hidden for role <strong>{currentUser.role.replace('_', ' ')}</strong> (RBAC policy enforced).</span>
          </div>
        </div>
      )}

      {/* Main Split Layout: Collabs List on Left, Active Collab Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filterable Project List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as CollabType | 'all')}
              className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="all">All Campaign Types</option>
              <option value="paid_sponsorship">Paid Sponsorships</option>
              <option value="organic_collab">Organic Collaborations</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CollabApprovalStatus | 'all')}
              className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="all">All Workflow Stages</option>
              <option value="concept_review">Concept Review</option>
              <option value="script_approved">Script Approved</option>
              <option value="draft_review">Draft Review</option>
              <option value="brand_approved">Brand Approved</option>
              <option value="ready_to_publish">Ready to Publish</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filteredCollabs.map((collab) => {
              const completedCount = collab.deliverables.filter((d) => d.completed).length;
              const totalDeliverables = collab.deliverables.length;
              const isSelected = activeCollab?.id === collab.id;

              return (
                <div
                  key={collab.id}
                  onClick={() => setSelectedCollabId(collab.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">{collab.brandName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        collab.approvalStatus === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : collab.approvalStatus === 'brand_approved'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {collab.approvalStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-xs line-clamp-1">{collab.title}</h3>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div>
                      {collab.collabType === 'paid_sponsorship' ? (
                        <span className="font-bold text-slate-900">
                          {isVaultUnlocked ? `$${collab.dealValue.toLocaleString()}` : maskSensitiveValue(collab.dealValue)}
                        </span>
                      ) : (
                        <span className="font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded text-[10px]">
                          Organic Collab
                        </span>
                      )}
                    </div>
                    <div className="text-[11px]">
                      {completedCount}/{totalDeliverables} Deliverables
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Collab Workflow Workspace */}
        {activeCollab ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Project Header Banner */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {activeCollab.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{activeCollab.brandContact}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{activeCollab.title}</h2>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Campaign Payout</div>
                  <div className="text-xl font-bold text-slate-900">
                    {activeCollab.collabType === 'paid_sponsorship'
                      ? isVaultUnlocked
                        ? `$${activeCollab.dealValue.toLocaleString()} USD`
                        : maskSensitiveValue(activeCollab.dealValue)
                      : 'Organic Promotion'}
                  </div>
                </div>
              </div>

              {/* Approval Workflow Progress Stepper */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Content Approval Stage:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[10px] font-semibold">
                  {stages.map((stage, i) => {
                    const currentIdx = stages.findIndex((s) => s.key === activeCollab.approvalStatus);
                    const isPassed = i <= currentIdx;
                    const isCurrent = stage.key === activeCollab.approvalStatus;

                    return (
                      <button
                        key={stage.key}
                        onClick={() => handleAdvanceStatus(stage.key)}
                        className={`py-2 px-1 rounded-lg transition-all border ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : isPassed
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FTC Compliance tag notice */}
              {activeCollab.ftcDisclosureRequired && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>FTC Legal Requirement: Creator must display mandatory tags on all deliverables:</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-[11px]">
                    {activeCollab.ftcTags.map((tag) => (
                      <span key={tag} className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Deliverables Checklist & Team Task Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Deliverables */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                  <span>Deliverables Checklist</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {activeCollab.deliverables.filter((d) => d.completed).length}/{activeCollab.deliverables.length}
                  </span>
                </h3>

                <div className="space-y-2">
                  {activeCollab.deliverables.map((del) => (
                    <div
                      key={del.id}
                      onClick={() => handleToggleDeliverable(del.id)}
                      className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={del.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className={`text-xs font-semibold ${del.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {del.title}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 capitalize">
                          <span>{del.platform}</span>
                          <span>·</span>
                          <span>Due {del.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Tasks */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Assigned Workflow Tasks
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeCollab.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="rounded text-indigo-600"
                        />
                        <span className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <img src={task.assignedToAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[10px] text-slate-500">{task.assignedToName.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add task inline form */}
                <form onSubmit={handleAddTask} className="pt-2 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add task for team..."
                    className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Collaboration Communication Thread */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Project Communication & Revision Thread
                  </h3>
                </div>
                <div className="text-xs text-slate-500">
                  Data Segregation Enforced
                </div>
              </div>

              {/* Message List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activeCollab.comments
                  .filter((c) => {
                    // Segregate internal only comments from brand partners
                    if (currentUser.role === 'brand_partner' && c.isInternalOnly) return false;
                    return true;
                  })
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        comment.isInternalOnly
                          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                          : 'bg-slate-50/70 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={comment.authorAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-semibold text-slate-900">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{comment.authorRole}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {comment.isInternalOnly && (
                            <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5 bg-amber-100 px-1.5 py-0.5 rounded">
                              <Lock className="w-2.5 h-2.5" />
                              Internal Only
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                        </div>
                      </div>
                      <p className="leading-relaxed pt-1 text-slate-700">{comment.text}</p>
                    </div>
                  ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSendComment} className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  {currentUser.role !== 'brand_partner' && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                      <input
                        type="checkbox"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Mark as <strong>Internal Studio Note</strong> (Hidden from brand partner)</span>
                    </label>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Type feedback, creative direction, or revision notes..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-12 rounded-xl border border-slate-200 text-center">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No collaboration selected</h4>
          </div>
        )}
      </div>

      {/* New Collab Deal Modal */}
      {isNewCollabOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Collaboration Project</h3>
            <form onSubmit={handleCreateCollab} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sony Wireless Headphones Q4 Showcase"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g. Sony Audio"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newBrandContact}
                    onChange={(e) => setNewBrandContact(e.target.value)}
                    placeholder="partner@brand.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Collaboration Type</label>
                  <select
                    value={newCollabType}
                    onChange={(e) => setNewCollabType(e.target.value as CollabType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="paid_sponsorship">Paid Sponsorship</option>
                    <option value="organic_collab">Organic Collaboration</option>
                    <option value="brand_ambassador">Brand Ambassador</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Deal Fee (USD)</label>
                  <input
                    type="number"
                    disabled={newCollabType === 'organic_collab'}
                    value={newCollabType === 'organic_collab' ? 0 : newDealValue}
                    onChange={(e) => setNewDealValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCollabOpen(false)}
                  className="px-3.5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-xs hover:bg-indigo-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Collaborator Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Invite Collaborator to Workspace</h3>
            <p className="text-xs text-slate-500">
              New team members or external brand partners receive role-segregated access to campaigns.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inviteName.trim() || !inviteEmail.trim()) return;
                onInviteCollaborator({ name: inviteName, email: inviteEmail, role: inviteRole });
                setIsInviteOpen(false);
                setInviteName('');
                setInviteEmail('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-medium text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="brand_partner">Brand Partner (Restricted to invited project only)</option>
                  <option value="creator">Creator / Editor (Content drafting & tasks)</option>
                  <option value="manager">Content Manager (Approval & scheduling)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-xs hover:bg-indigo-700"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
