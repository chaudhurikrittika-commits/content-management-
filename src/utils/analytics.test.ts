import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterPosts,
  sortPosts,
  calculateAggregateMetrics,
  calculateCollabFinancials
} from './analytics.ts';
import { PostItem, CollabProject } from '../types/index.ts';

const mockPosts: PostItem[] = [
  {
    id: 'post-1',
    title: 'Instagram Reel: Morning Routine',
    caption: 'Start your productive day with 3 daily habits',
    platforms: ['instagram', 'facebook'],
    mediaType: 'reel',
    scheduledFor: '2026-11-01T10:00:00Z',
    publishedAt: '2026-11-01T10:00:00Z',
    status: 'published',
    tags: ['productivity', 'morning'],
    createdBy: { id: 'u1', name: 'Shanaya', avatar: '' },
    metrics: {
      impressions: 45000,
      reach: 38000,
      likes: 2400,
      comments: 320,
      shares: 410,
      saves: 590,
      clicks: 120,
      engagementRate: 9.8
    }
  },
  {
    id: 'post-2',
    title: 'YouTube Short: Tech Stack 2026',
    caption: 'Everything powering our AI apps this year',
    platforms: ['youtube', 'tiktok'],
    mediaType: 'short',
    scheduledFor: '2026-11-05T14:00:00Z',
    publishedAt: '2026-11-05T14:00:00Z',
    status: 'published',
    tags: ['tech', 'ai'],
    createdBy: { id: 'u1', name: 'Shanaya', avatar: '' },
    metrics: {
      impressions: 80000,
      reach: 72000,
      likes: 3100,
      comments: 180,
      shares: 950,
      saves: 400,
      clicks: 340,
      engagementRate: 6.9
    }
  },
  {
    id: 'post-3',
    title: 'LinkedIn Carousel: Growth Playbook',
    caption: 'How we scaled audience by 340% organically',
    platforms: ['linkedin'],
    mediaType: 'carousel',
    scheduledFor: '2026-11-12T16:00:00Z',
    status: 'scheduled',
    tags: ['growth', 'b2b'],
    createdBy: { id: 'u1', name: 'Shanaya', avatar: '' }
  }
];

test('filterPosts filters by platform', () => {
  const igPosts = filterPosts(mockPosts, { platform: 'instagram' });
  assert.equal(igPosts.length, 1);
  assert.equal(igPosts[0].id, 'post-1');

  const allPosts = filterPosts(mockPosts, { platform: 'all' });
  assert.equal(allPosts.length, 3);
});

test('filterPosts filters by search query and status', () => {
  const searchResults = filterPosts(mockPosts, { searchQuery: 'Tech Stack' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 'post-2');

  const scheduledOnly = filterPosts(mockPosts, { status: 'scheduled' });
  assert.equal(scheduledOnly.length, 1);
  assert.equal(scheduledOnly[0].id, 'post-3');
});

test('sortPosts sorts correctly by engagementRate descending', () => {
  const sorted = sortPosts(mockPosts, 'engagementRate', 'desc');
  assert.equal(sorted[0].id, 'post-1'); // 9.8%
  assert.equal(sorted[1].id, 'post-2'); // 6.9%
  assert.equal(sorted[2].id, 'post-3'); // undefined/0
});

test('sortPosts sorts correctly by reach descending', () => {
  const sorted = sortPosts(mockPosts, 'reach', 'desc');
  assert.equal(sorted[0].id, 'post-2'); // 72,000
  assert.equal(sorted[1].id, 'post-1'); // 38,000
});

test('calculateAggregateMetrics calculates totals and blended averages', () => {
  const metrics = calculateAggregateMetrics(mockPosts);
  assert.equal(metrics.totalPosts, 3);
  assert.equal(metrics.totalReach, 110000);
  assert.equal(metrics.totalImpressions, 125000);
  assert.equal(metrics.totalLikes, 5500);
  assert.equal(metrics.avgEngagementRate, 8.35); // (9.8 + 6.9) / 2 = 8.35
  assert.ok(metrics.outperformerCount >= 1);
});

test('calculateCollabFinancials aggregates paid and pipeline values', () => {
  const mockCollabs: CollabProject[] = [
    {
      id: 'c1',
      title: 'NordVPN Sponsorship',
      collabType: 'paid_sponsorship',
      brandName: 'NordVPN',
      brandContact: 'partners@nord.com',
      dealValue: 5000,
      currency: 'USD',
      isPaid: true,
      approvalStatus: 'published',
      deliverables: [{ id: 'd1', title: 'Reel Integration', platform: 'instagram', mediaType: 'reel', completed: true, dueDate: '2026-11-01' }],
      tasks: [],
      comments: [],
      collaboratorIds: ['u1'],
      contractTerms: 'Net 30',
      ftcDisclosureRequired: true,
      ftcTags: ['#ad'],
      targetReach: 50000,
      category: 'Cybersecurity',
      updatedAt: '2026-11-01'
    },
    {
      id: 'c2',
      title: 'Adobe Premiere Pro Campaign',
      collabType: 'paid_sponsorship',
      brandName: 'Adobe',
      brandContact: 'creators@adobe.com',
      dealValue: 7500,
      currency: 'USD',
      isPaid: false,
      approvalStatus: 'draft_review',
      deliverables: [{ id: 'd2', title: 'YouTube Tutorial', platform: 'youtube', mediaType: 'video', completed: false, dueDate: '2026-11-20' }],
      tasks: [],
      comments: [],
      collaboratorIds: ['u1'],
      contractTerms: 'Net 15 upon publishing',
      ftcDisclosureRequired: true,
      ftcTags: ['#sponsored'],
      targetReach: 75000,
      category: 'Creative Tech',
      updatedAt: '2026-11-08'
    }
  ];

  const financials = calculateCollabFinancials(mockCollabs);
  assert.equal(financials.totalPipelineValue, 12500);
  assert.equal(financials.paidEarnings, 5000);
  assert.equal(financials.inReviewValue, 7500);
  assert.equal(financials.totalDeals, 2);
  assert.equal(financials.pendingDeliverablesCount, 1);
});
