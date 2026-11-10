export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin' | 'x' | 'pinterest';

export type MediaType = 'reel' | 'carousel' | 'post' | 'story' | 'short' | 'video' | 'thread';

export type PostStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'queued';

export interface PostMetrics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  watchTimeMinutes?: number;
  engagementRate: number; // percentage e.g. 5.8
}

export interface PostItem {
  id: string;
  title: string;
  caption: string;
  platforms: SocialPlatform[];
  mediaType: MediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  scheduledFor: string; // ISO string
  publishedAt?: string;
  status: PostStatus;
  metrics?: PostMetrics;
  tags: string[];
  collabId?: string;
  notes?: string;
  encryptedNotes?: string; // Encrypted with AES-GCM
  assignedTo?: string; // User ID
  approvedBy?: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
}

export type CollabType = 'paid_sponsorship' | 'organic_collab' | 'affiliate' | 'brand_ambassador';

export type CollabApprovalStatus = 'concept_review' | 'script_approved' | 'draft_review' | 'brand_approved' | 'ready_to_publish' | 'published';
export type CollabStatus = CollabApprovalStatus;

export interface CollabTask {
  id: string;
  title: string;
  assignedToUserId: string;
  assignedToName: string;
  assignedToAvatar: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface CollabComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timestamp: string;
  text: string;
  isInternalOnly: boolean; // Segregated from external brand collaborators
}

export interface CollabDeliverable {
  id: string;
  title: string;
  platform: SocialPlatform;
  mediaType: MediaType;
  completed: boolean;
  dueDate: string;
  assignedPostId?: string;
}

export interface CollabProject {
  id: string;
  title: string;
  collabType: CollabType;
  brandName: string;
  brandContact: string;
  dealValue: number; // USD (0 for organic)
  currency: string;
  isPaid: boolean;
  approvalStatus: CollabApprovalStatus;
  deliverables: CollabDeliverable[];
  tasks: CollabTask[];
  comments: CollabComment[];
  collaboratorIds: string[]; // Segregated workspace access
  contractTerms: string;
  encryptedFinancials?: string; // AES-GCM encrypted payout & wire details
  ftcDisclosureRequired: boolean;
  ftcTags: string[]; // e.g. ["#ad", "#sponsored"]
  targetReach: number;
  actualReach?: number;
  actualEngagementRate?: number;
  payoutDate?: string;
  category: string;
  updatedAt: string;
}

export type UserRole = 'owner' | 'manager' | 'creator' | 'reviewer' | 'brand_partner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  workspaceId: string;
  permissions: {
    canPublish: boolean;
    canManageCollabs: boolean;
    canViewFinancials: boolean;
    canManageSecurity: boolean;
    canApproveContent: boolean;
  };
  mfaEnabled: boolean;
  lastActive: string;
}

export interface PlatformAccount {
  platform: SocialPlatform;
  handle: string;
  displayName: string;
  avatar: string;
  followers: number;
  followerGrowthPercent: number;
  connected: boolean;
  lastSynced: string;
  metrics: {
    totalPosts: number;
    totalReach: number;
    avgEngagementRate: number;
    bestPostingHours: string[];
    topContentFormat: string;
    impressions30d: number;
  };
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'LOGIN' | 'MFA_CHALLENGE' | 'VAULT_UNLOCK' | 'VAULT_LOCK' | 'KEY_ROTATION' | 'POST_PUBLISHED' | 'COLLAB_FINANCIAL_ACCESS' | 'DATA_EXPORT';
  status: 'SUCCESS' | 'FLAGGED' | 'BLOCKED';
  ipAddress: string;
  details: string;
}

export interface AIStrategyResult {
  niche: string;
  healthScore: number;
  executiveSummary: string;
  optimalPostingTimes: Array<{
    platform: SocialPlatform;
    peakDays: string[];
    peakHours: string[];
    rationale: string;
  }>;
  contentTypesAudienceAffinity: Array<{
    type: MediaType;
    affinityScore: number; // 0-100
    whyItWorks: string;
    bestPlatforms: SocialPlatform[];
  }>;
  trendingTopics: Array<{
    topic: string;
    trendVelocity: 'Spike' | 'Rising' | 'Evergreen';
    suggestedHook: string;
    targetPlatforms: SocialPlatform[];
  }>;
  engagementImprovementTactics: string[];
  anonymizedSimilarAccountsInsights: Array<{
    accountType: string;
    keyLearnings: string;
    recommendedTacticToAdopt: string;
  }>;
  highConvertingCTA: string[];
}
