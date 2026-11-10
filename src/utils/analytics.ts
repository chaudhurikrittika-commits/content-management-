import { PostItem, SocialPlatform, MediaType, PostStatus, CollabProject } from '../types/index.ts';

export type SortField = 'engagementRate' | 'reach' | 'impressions' | 'likes' | 'comments' | 'shares' | 'scheduledFor';
export type SortOrder = 'asc' | 'desc';

export interface AggregateMetrics {
  totalPosts: number;
  totalReach: number;
  totalImpressions: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  totalClicks: number;
  avgEngagementRate: number;
  outperformerCount: number;
}

/**
 * Filter posts by platform, status, and date range in days
 */
export function filterPosts(
  posts: PostItem[],
  filters: {
    platform?: SocialPlatform | 'all';
    status?: PostStatus | 'all';
    mediaType?: MediaType | 'all';
    daysRange?: number; // e.g. 7, 30, 90, or 0 for all
    searchQuery?: string;
  }
): PostItem[] {
  const now = Date.now();
  const maxAgeMs = filters.daysRange && filters.daysRange > 0 ? filters.daysRange * 24 * 60 * 60 * 1000 : null;

  return posts.filter((post) => {
    // Platform match
    if (filters.platform && filters.platform !== 'all') {
      if (!post.platforms.includes(filters.platform)) return false;
    }

    // Status match
    if (filters.status && filters.status !== 'all') {
      if (post.status !== filters.status) return false;
    }

    // Media type match
    if (filters.mediaType && filters.mediaType !== 'all') {
      if (post.mediaType !== filters.mediaType) return false;
    }

    // Date range match
    if (maxAgeMs !== null) {
      const postDate = new Date(post.publishedAt || post.scheduledFor).getTime();
      if (now - postDate > maxAgeMs) return false;
    }

    // Search query match
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const query = filters.searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchCaption = post.caption.toLowerCase().includes(query);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchCaption && !matchTags) return false;
    }

    return true;
  });
}

/**
 * Sort posts by specified field and direction
 */
export function sortPosts(posts: PostItem[], field: SortField, order: SortOrder = 'desc'): PostItem[] {
  return [...posts].sort((a, b) => {
    let aVal = 0;
    let bVal = 0;

    if (field === 'scheduledFor') {
      aVal = new Date(a.publishedAt || a.scheduledFor).getTime();
      bVal = new Date(b.publishedAt || b.scheduledFor).getTime();
    } else {
      aVal = a.metrics ? a.metrics[field] || 0 : 0;
      bVal = b.metrics ? b.metrics[field] || 0 : 0;
    }

    if (order === 'asc') {
      return aVal - bVal;
    }
    return bVal - aVal;
  });
}

/**
 * Aggregate cross-platform metrics
 */
export function calculateAggregateMetrics(posts: PostItem[]): AggregateMetrics {
  const publishedPosts = posts.filter((p) => p.status === 'published' && p.metrics);
  if (publishedPosts.length === 0) {
    return {
      totalPosts: posts.length,
      totalReach: 0,
      totalImpressions: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSaves: 0,
      totalClicks: 0,
      avgEngagementRate: 0,
      outperformerCount: 0
    };
  }

  let totalReach = 0;
  let totalImpressions = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalSaves = 0;
  let totalClicks = 0;
  let engagementRateSum = 0;

  for (const post of publishedPosts) {
    const m = post.metrics!;
    totalReach += m.reach;
    totalImpressions += m.impressions;
    totalLikes += m.likes;
    totalComments += m.comments;
    totalShares += m.shares;
    totalSaves += m.saves;
    totalClicks += m.clicks;
    engagementRateSum += m.engagementRate;
  }

  const avgEngagementRate = Number((engagementRateSum / publishedPosts.length).toFixed(2));
  
  // An outperformer post is defined as achieving >= 1.15x the average engagement rate
  const outperformerThreshold = avgEngagementRate * 1.15;
  const outperformerCount = publishedPosts.filter((p) => (p.metrics?.engagementRate || 0) >= outperformerThreshold).length;

  return {
    totalPosts: posts.length,
    totalReach,
    totalImpressions,
    totalLikes,
    totalComments,
    totalShares,
    totalSaves,
    totalClicks,
    avgEngagementRate,
    outperformerCount
  };
}

/**
 * Calculate financial totals and pipeline metrics for Collabs
 */
export function calculateCollabFinancials(collabs: CollabProject[]): {
  totalPipelineValue: number;
  paidEarnings: number;
  inReviewValue: number;
  totalDeals: number;
  paidDealsCount: number;
  pendingDeliverablesCount: number;
} {
  let totalPipelineValue = 0;
  let paidEarnings = 0;
  let inReviewValue = 0;
  let paidDealsCount = 0;
  let pendingDeliverablesCount = 0;

  for (const collab of collabs) {
    totalPipelineValue += collab.dealValue;
    if (collab.isPaid || collab.approvalStatus === 'published') {
      paidEarnings += collab.dealValue;
      paidDealsCount++;
    } else if (collab.approvalStatus === 'draft_review' || collab.approvalStatus === 'brand_approved') {
      inReviewValue += collab.dealValue;
    }

    const pending = collab.deliverables.filter((d) => !d.completed).length;
    pendingDeliverablesCount += pending;
  }

  return {
    totalPipelineValue,
    paidEarnings,
    inReviewValue,
    totalDeals: collabs.length,
    paidDealsCount,
    pendingDeliverablesCount
  };
}
