import { PlatformAccount, PostItem, CollabProject, UserProfile, SecurityAuditEntry } from '../types/index.ts';

export const initialPlatformAccounts: PlatformAccount[] = [
  {
    platform: 'instagram',
    handle: '@shanayacreates',
    displayName: 'Shanaya Singh · Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 184200,
    followerGrowthPercent: 8.4,
    connected: true,
    lastSynced: '10 mins ago',
    metrics: {
      totalPosts: 142,
      totalReach: 485000,
      avgEngagementRate: 6.2,
      bestPostingHours: ['11:00 AM', '6:30 PM', '8:00 PM'],
      topContentFormat: 'Reel (9:16 Video)',
      impressions30d: 820000
    }
  },
  {
    platform: 'facebook',
    handle: 'Shanaya Studio Official',
    displayName: 'Shanaya Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 96400,
    followerGrowthPercent: 4.1,
    connected: true,
    lastSynced: '15 mins ago',
    metrics: {
      totalPosts: 88,
      totalReach: 215000,
      avgEngagementRate: 3.8,
      bestPostingHours: ['1:00 PM', '7:00 PM'],
      topContentFormat: 'Video & Photo Carousels',
      impressions30d: 390000
    }
  },
  {
    platform: 'youtube',
    handle: '@ShanayaTechStudio',
    displayName: 'Shanaya Studio & Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 312500,
    followerGrowthPercent: 12.3,
    connected: true,
    lastSynced: '5 mins ago',
    metrics: {
      totalPosts: 94,
      totalReach: 890000,
      avgEngagementRate: 7.9,
      bestPostingHours: ['2:00 PM', '5:00 PM', '9:00 PM'],
      topContentFormat: 'YouTube Shorts & Longform',
      impressions30d: 1420000
    }
  },
  {
    platform: 'tiktok',
    handle: '@shanaya_vibe',
    displayName: 'Shanaya · Creative Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 420800,
    followerGrowthPercent: 19.5,
    connected: true,
    lastSynced: '12 mins ago',
    metrics: {
      totalPosts: 210,
      totalReach: 1240000,
      avgEngagementRate: 9.4,
      bestPostingHours: ['12:00 PM', '4:30 PM', '10:00 PM'],
      topContentFormat: 'Short-form Vertical Video',
      impressions30d: 2150000
    }
  },
  {
    platform: 'linkedin',
    handle: 'in/shanayasingh',
    displayName: 'Shanaya Singh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 48900,
    followerGrowthPercent: 15.2,
    connected: true,
    lastSynced: '30 mins ago',
    metrics: {
      totalPosts: 65,
      totalReach: 180000,
      avgEngagementRate: 5.1,
      bestPostingHours: ['8:30 AM', '12:00 PM'],
      topContentFormat: 'Document Carousels',
      impressions30d: 295000
    }
  },
  {
    platform: 'x',
    handle: '@shanaya_builds',
    displayName: 'Shanaya ⚡',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 64200,
    followerGrowthPercent: 6.8,
    connected: false,
    lastSynced: '2 days ago',
    metrics: {
      totalPosts: 340,
      totalReach: 190000,
      avgEngagementRate: 3.2,
      bestPostingHours: ['9:00 AM', '3:00 PM'],
      topContentFormat: 'Threads & Media',
      impressions30d: 310000
    }
  }
];

export const initialTeamProfiles: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Shanaya Singh',
    email: 'shanayasingh1998shanaya@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'owner',
    workspaceId: 'ws-main',
    permissions: {
      canPublish: true,
      canManageCollabs: true,
      canViewFinancials: true,
      canManageSecurity: true,
      canApproveContent: true
    },
    mfaEnabled: true,
    lastActive: 'Active now'
  },
  {
    id: 'usr-2',
    name: 'Alex Chen',
    email: 'alex.chen@creativeteam.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    workspaceId: 'ws-main',
    permissions: {
      canPublish: true,
      canManageCollabs: true,
      canViewFinancials: false,
      canManageSecurity: false,
      canApproveContent: true
    },
    mfaEnabled: true,
    lastActive: '12 mins ago'
  },
  {
    id: 'usr-3',
    name: 'Priya Patel',
    email: 'priya.editor@creativeteam.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'creator',
    workspaceId: 'ws-main',
    permissions: {
      canPublish: false,
      canManageCollabs: false,
      canViewFinancials: false,
      canManageSecurity: false,
      canApproveContent: false
    },
    mfaEnabled: false,
    lastActive: '1 hour ago'
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance (Brand Partner)',
    email: 'marcus@adobe.brandcollab.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'brand_partner',
    workspaceId: 'ws-main',
    permissions: {
      canPublish: false,
      canManageCollabs: false,
      canViewFinancials: false,
      canManageSecurity: false,
      canApproveContent: true
    },
    mfaEnabled: true,
    lastActive: '3 hours ago'
  }
];

export const initialPosts: PostItem[] = [
  {
    id: 'post-101',
    title: 'Top 5 AI Tools That Save 20+ Hours Every Week',
    caption: 'Stop doing manual busywork in 2026. Here are the 5 high-leverage AI workflows my studio relies on daily. Drop a comment for the free prompt cheat-sheet! 👇 #AITools #Productivity #CreatorEconomy',
    platforms: ['instagram', 'facebook', 'tiktok'],
    mediaType: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    scheduledFor: '2026-11-04T11:30:00Z',
    publishedAt: '2026-11-04T11:30:00Z',
    status: 'published',
    tags: ['ai', 'productivity', 'workflows', 'reel'],
    createdBy: {
      id: 'usr-1',
      name: 'Shanaya Singh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    metrics: {
      impressions: 142000,
      reach: 118000,
      likes: 9420,
      comments: 680,
      shares: 1850,
      saves: 3200,
      clicks: 840,
      engagementRate: 12.8,
      watchTimeMinutes: 14800
    }
  },
  {
    id: 'post-102',
    title: 'Sony Studio Wireless ANC Headphones Review',
    caption: 'Full sound breakdown on the new Sony flagship studio gear. Are they worth upgrading if you produce podcasts or edit reels on the go? Sponsored breakdown with honest mic testing! #ad #SonyAudio #StudioSetup',
    platforms: ['youtube', 'instagram'],
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    scheduledFor: '2026-11-06T15:00:00Z',
    publishedAt: '2026-11-06T15:00:00Z',
    status: 'published',
    collabId: 'collab-2',
    tags: ['techreview', 'sony', 'audio', 'collab'],
    createdBy: {
      id: 'usr-1',
      name: 'Shanaya Singh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    metrics: {
      impressions: 98000,
      reach: 84000,
      likes: 5820,
      comments: 410,
      shares: 720,
      saves: 1150,
      clicks: 1240,
      engagementRate: 9.6,
      watchTimeMinutes: 38200
    }
  },
  {
    id: 'post-103',
    title: 'Zero to 500K Audience: The 4 Creator Traps',
    caption: 'Most creators burn out trying to be on every platform equally. Here is the hub-and-spoke repurposing model we used to generate 3M impressions in 90 days without 14-hour workdays. Swipe through -> 📊',
    platforms: ['linkedin', 'facebook'],
    mediaType: 'carousel',
    mediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
    scheduledFor: '2026-11-08T13:00:00Z',
    publishedAt: '2026-11-08T13:00:00Z',
    status: 'published',
    tags: ['strategy', 'growth', 'audience', 'linkedin'],
    createdBy: {
      id: 'usr-2',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    metrics: {
      impressions: 62000,
      reach: 51000,
      likes: 3120,
      comments: 290,
      shares: 440,
      saves: 980,
      clicks: 390,
      engagementRate: 9.4
    }
  },
  {
    id: 'post-104',
    title: 'Adobe Premiere Pro AI Speed Editing Masterclass',
    caption: 'Step-by-step breakdown of generative video extensions and transcript-based cutouts. Paid partnership with Adobe. Full preset pack in bio! #AdobePartner #VideoEditing #PremierePro',
    platforms: ['youtube', 'tiktok', 'instagram'],
    mediaType: 'short',
    mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80',
    scheduledFor: '2026-11-12T16:30:00Z',
    status: 'scheduled',
    collabId: 'collab-1',
    tags: ['adobe', 'tutorial', 'editing', 'sponsored'],
    assignedTo: 'usr-3',
    approvedBy: 'usr-4',
    createdBy: {
      id: 'usr-1',
      name: 'Shanaya Singh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'post-105',
    title: 'My Complete Morning Filming Checklist',
    caption: 'Lighting setup, wireless lav testing, 4K color profile check. 10 minutes that prevents 3 hours of reshoots. Save this for your next batch filming day!',
    platforms: ['instagram', 'facebook'],
    mediaType: 'carousel',
    mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&auto=format&fit=crop&q=80',
    scheduledFor: '2026-11-14T12:00:00Z',
    status: 'scheduled',
    tags: ['filming', 'creatorlife', 'checklist'],
    createdBy: {
      id: 'usr-3',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'post-106',
    title: 'NordVPN: How Creators Protect Their Brand Accounts',
    caption: 'Why SIM swapping & unsecured cafe WiFi are the #1 way creators lose 500K accounts. Setting up dedicated IP and encrypted tunnels in 60 seconds.',
    platforms: ['instagram', 'tiktok', 'youtube'],
    mediaType: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
    scheduledFor: '2026-11-16T17:00:00Z',
    status: 'review',
    collabId: 'collab-3',
    tags: ['cybersecurity', 'vpn', 'collab', 'nordvpn'],
    assignedTo: 'usr-1',
    createdBy: {
      id: 'usr-1',
      name: 'Shanaya Singh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'post-107',
    title: 'The Future of Social Algorithms in 2027',
    caption: 'Deep dive into multimodal search indexing on TikTok and Instagram. How your spoken audio and on-screen text now determine 70% of viral recommendations.',
    platforms: ['linkedin', 'youtube'],
    mediaType: 'thread',
    scheduledFor: '2026-11-18T14:00:00Z',
    status: 'draft',
    tags: ['algorithms', 'future', 'analytics'],
    createdBy: {
      id: 'usr-2',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  }
];

export const initialCollabProjects: CollabProject[] = [
  {
    id: 'collab-1',
    title: 'Adobe Premiere Pro AI Creative Campaign',
    collabType: 'paid_sponsorship',
    brandName: 'Adobe',
    brandContact: 'marcus@adobe.brandcollab.com',
    dealValue: 8500,
    currency: 'USD',
    isPaid: false,
    approvalStatus: 'brand_approved',
    deliverables: [
      {
        id: 'del-1',
        title: '1x YouTube 60s Dedicated Short',
        platform: 'youtube',
        mediaType: 'short',
        completed: true,
        dueDate: '2026-11-12',
        assignedPostId: 'post-104'
      },
      {
        id: 'del-2',
        title: '1x Instagram Reel with Link Sticker in Story',
        platform: 'instagram',
        mediaType: 'reel',
        completed: false,
        dueDate: '2026-11-15'
      },
      {
        id: 'del-3',
        title: '1x TikTok Behind-The-Scenes Cut',
        platform: 'tiktok',
        mediaType: 'short',
        completed: false,
        dueDate: '2026-11-17'
      }
    ],
    tasks: [
      {
        id: 'tsk-1',
        title: 'Record screen capture of new generative fill feature',
        assignedToUserId: 'usr-3',
        assignedToName: 'Priya Patel',
        assignedToAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        dueDate: '2026-11-10',
        completed: true,
        priority: 'high'
      },
      {
        id: 'tsk-2',
        title: 'Add brand approved disclaimer card and tracking bit.ly link',
        assignedToUserId: 'usr-2',
        assignedToName: 'Alex Chen',
        assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        dueDate: '2026-11-11',
        completed: true,
        priority: 'medium'
      },
      {
        id: 'tsk-3',
        title: 'Deliver final 4K export to brand portal for final sign-off',
        assignedToUserId: 'usr-1',
        assignedToName: 'Shanaya Singh',
        assignedToAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        dueDate: '2026-11-12',
        completed: false,
        priority: 'high'
      }
    ],
    comments: [
      {
        id: 'cmt-1',
        authorId: 'usr-4',
        authorName: 'Marcus Vance (Brand Partner)',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Adobe Partner Marketing',
        timestamp: 'Nov 8, 2026, 4:15 PM',
        text: 'The script looks terrific Shanaya! Please ensure the Adobe Creative Cloud logo is displayed in the lower right corner during the first 3 seconds.',
        isInternalOnly: false
      },
      {
        id: 'cmt-2',
        authorId: 'usr-1',
        authorName: 'Shanaya Singh',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Studio Owner',
        timestamp: 'Nov 8, 2026, 5:30 PM',
        text: 'Noted Marcus! Priya updated the lower-third graphic and the 60s short is scheduled for Nov 12.',
        isInternalOnly: false
      },
      {
        id: 'cmt-3',
        authorId: 'usr-2',
        authorName: 'Alex Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Content Manager',
        timestamp: 'Nov 9, 2026, 10:00 AM',
        text: '[Internal Note] Verified our invoice with their accounts payable department. Net 15 payout will trigger automatically post-launch.',
        isInternalOnly: true
      }
    ],
    collaboratorIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4'],
    contractTerms: 'Exclusive creative tools category lock for 14 days post publication. Net 15 payment terms.',
    encryptedFinancials: 'Payout Wire: Chase Studio Acct ••••8291 · Total Fee: $8,500.00 USD',
    ftcDisclosureRequired: true,
    ftcTags: ['#ad', '#sponsored', '#AdobePartner'],
    targetReach: 150000,
    actualReach: 110000,
    category: 'Creative Software',
    payoutDate: '2026-11-27',
    updatedAt: '2026-11-09T18:00:00Z'
  },
  {
    id: 'collab-2',
    title: 'Sony Wireless ANC Studio Headphones Launch',
    collabType: 'paid_sponsorship',
    brandName: 'Sony Audio',
    brandContact: 'creators@sony.electronics.com',
    dealValue: 6200,
    currency: 'USD',
    isPaid: true,
    approvalStatus: 'published',
    deliverables: [
      {
        id: 'del-4',
        title: '1x YouTube Dedicated Tech Review Video',
        platform: 'youtube',
        mediaType: 'video',
        completed: true,
        dueDate: '2026-11-06',
        assignedPostId: 'post-102'
      },
      {
        id: 'del-5',
        title: '3x Instagram Story Frames with Swipe Up Link',
        platform: 'instagram',
        mediaType: 'story',
        completed: true,
        dueDate: '2026-11-06'
      }
    ],
    tasks: [],
    comments: [
      {
        id: 'cmt-4',
        authorId: 'usr-1',
        authorName: 'Shanaya Singh',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Studio Owner',
        timestamp: 'Nov 6, 2026, 9:00 PM',
        text: 'Post is live and already crossed 84,000 organic reach in first 48 hours!',
        isInternalOnly: false
      }
    ],
    collaboratorIds: ['usr-1', 'usr-2'],
    contractTerms: '30 days organic usage rights with whitelisting permission for Instagram ads.',
    encryptedFinancials: 'Payout Wire: Chase Studio Acct ••••8291 · Received: $6,200.00 USD via ACH',
    ftcDisclosureRequired: true,
    ftcTags: ['#ad', '#SonyAudio'],
    targetReach: 80000,
    actualReach: 84000,
    actualEngagementRate: 9.6,
    category: 'Audio & Tech',
    payoutDate: '2026-11-07',
    updatedAt: '2026-11-07T12:00:00Z'
  },
  {
    id: 'collab-3',
    title: 'NordVPN Cybersecurity Awareness Campaign',
    collabType: 'paid_sponsorship',
    brandName: 'NordVPN',
    brandContact: 'affiliates@nordsecurity.com',
    dealValue: 5000,
    currency: 'USD',
    isPaid: false,
    approvalStatus: 'draft_review',
    deliverables: [
      {
        id: 'del-6',
        title: '1x Multi-Platform Reel Integration (IG & TikTok)',
        platform: 'instagram',
        mediaType: 'reel',
        completed: false,
        dueDate: '2026-11-16',
        assignedPostId: 'post-106'
      }
    ],
    tasks: [
      {
        id: 'tsk-4',
        title: 'Record live demonstration on public WiFi hot-spot',
        assignedToUserId: 'usr-1',
        assignedToName: 'Shanaya Singh',
        assignedToAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        dueDate: '2026-11-13',
        completed: false,
        priority: 'high'
      }
    ],
    comments: [
      {
        id: 'cmt-5',
        authorId: 'usr-2',
        authorName: 'Alex Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Content Manager',
        timestamp: 'Nov 8, 2026, 11:20 AM',
        text: 'NordVPN rep asked to highlight Threat Protection feature along with 70% holiday discount coupon code.',
        isInternalOnly: true
      }
    ],
    collaboratorIds: ['usr-1', 'usr-2'],
    contractTerms: 'Custom coupon code SHANAYA2026 with 10% rev share on renewals.',
    encryptedFinancials: 'Payout Wire: Chase Studio Acct ••••8291 · Flat Fee $5,000 + 10% RevShare',
    ftcDisclosureRequired: true,
    ftcTags: ['#ad', '#sponsored'],
    targetReach: 100000,
    category: 'Cybersecurity',
    updatedAt: '2026-11-08T15:00:00Z'
  },
  {
    id: 'collab-4',
    title: 'AI Creators Collective Cross-Promotion',
    collabType: 'organic_collab',
    brandName: 'Creators Guild Global',
    brandContact: 'collabs@creatorsguild.org',
    dealValue: 0,
    currency: 'USD',
    isPaid: false,
    approvalStatus: 'concept_review',
    deliverables: [
      {
        id: 'del-7',
        title: 'Joint Instagram Collaborative Carousel Post',
        platform: 'instagram',
        mediaType: 'carousel',
        completed: false,
        dueDate: '2026-11-22'
      }
    ],
    tasks: [
      {
        id: 'tsk-5',
        title: 'Draft joint questions for the community roundup',
        assignedToUserId: 'usr-2',
        assignedToName: 'Alex Chen',
        assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        dueDate: '2026-11-15',
        completed: false,
        priority: 'medium'
      }
    ],
    comments: [
      {
        id: 'cmt-6',
        authorId: 'usr-1',
        authorName: 'Shanaya Singh',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Studio Owner',
        timestamp: 'Nov 9, 2026, 2:00 PM',
        text: 'Organic collaboration to cross-pollinate 150K new creator audience members.',
        isInternalOnly: false
      }
    ],
    collaboratorIds: ['usr-1', 'usr-2'],
    contractTerms: 'Mutual organic co-author tag on Instagram & LinkedIn.',
    ftcDisclosureRequired: false,
    ftcTags: ['#collab'],
    targetReach: 75000,
    category: 'Creator Community',
    updatedAt: '2026-11-09T14:00:00Z'
  }
];

export const initialSecurityLogs: SecurityAuditEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-10T08:30:12Z',
    userId: 'usr-1',
    userName: 'Shanaya Singh',
    action: 'LOGIN',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104 (San Francisco, CA)',
    details: 'Hardware-verified OAuth session established'
  },
  {
    id: 'log-2',
    timestamp: '2026-11-10T08:30:45Z',
    userId: 'usr-1',
    userName: 'Shanaya Singh',
    action: 'MFA_CHALLENGE',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104 (San Francisco, CA)',
    details: 'TOTP 6-digit authenticator code verified'
  },
  {
    id: 'log-3',
    timestamp: '2026-11-10T08:31:02Z',
    userId: 'usr-1',
    userName: 'Shanaya Singh',
    action: 'VAULT_UNLOCK',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104 (San Francisco, CA)',
    details: 'PBKDF2 key derived; AES-256-GCM vault unlocked'
  },
  {
    id: 'log-4',
    timestamp: '2026-11-09T17:45:00Z',
    userId: 'usr-2',
    userName: 'Alex Chen',
    action: 'COLLAB_FINANCIAL_ACCESS',
    status: 'BLOCKED',
    ipAddress: '10.0.0.42 (Seattle, WA)',
    details: 'Permission denied: Role MANAGER lacks canViewFinancials permission'
  }
];
