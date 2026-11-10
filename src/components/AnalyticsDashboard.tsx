import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Filter,
  ArrowUpDown,
  Search,
  Download,
  ExternalLink,
  ChevronDown,
  Sparkles,
  BarChart2,
  Flame,
  LayoutGrid,
  List
} from 'lucide-react';
import { PostItem, PlatformAccount, SocialPlatform, MediaType, PostStatus } from '../types/index.ts';
import { filterPosts, sortPosts, calculateAggregateMetrics, SortField, SortOrder } from '../utils/analytics.ts';

interface AnalyticsDashboardProps {
  posts: PostItem[];
  platformAccounts: PlatformAccount[];
  onSelectPost: (post: PostItem) => void;
  onNavigateToAI: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  posts,
  platformAccounts,
  onSelectPost,
  onNavigateToAI
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [dateRangeDays, setDateRangeDays] = useState<number>(30); // 7, 30, 90, 0
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('engagementRate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [chartMetric, setChartMetric] = useState<'reach' | 'impressions'>('reach');

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return filterPosts(posts, {
      platform: selectedPlatform,
      status: statusFilter,
      mediaType: mediaTypeFilter,
      daysRange: dateRangeDays,
      searchQuery
    });
  }, [posts, selectedPlatform, statusFilter, mediaTypeFilter, dateRangeDays, searchQuery]);

  const sortedPosts = useMemo(() => {
    return sortPosts(filteredPosts, sortField, sortOrder);
  }, [filteredPosts, sortField, sortOrder]);

  // Aggregate metrics
  const aggregateMetrics = useMemo(() => {
    return calculateAggregateMetrics(filteredPosts);
  }, [filteredPosts]);

  // Total followers across connected accounts
  const totalFollowers = useMemo(() => {
    if (selectedPlatform === 'all') {
      return platformAccounts.reduce((acc, p) => acc + (p.connected ? p.followers : 0), 0);
    }
    const target = platformAccounts.find((p) => p.platform === selectedPlatform);
    return target ? target.followers : 0;
  }, [platformAccounts, selectedPlatform]);

  // Format platform badge helper
  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return <span className="text-pink-600 font-bold text-xs">IG</span>;
      case 'facebook':
        return <span className="text-blue-600 font-bold text-xs">FB</span>;
      case 'youtube':
        return <span className="text-red-600 font-bold text-xs">YT</span>;
      case 'tiktok':
        return <span className="text-slate-900 font-bold text-xs">TT</span>;
      case 'linkedin':
        return <span className="text-blue-700 font-bold text-xs">IN</span>;
      case 'x':
        return <span className="text-slate-800 font-bold text-xs">X</span>;
      default:
        return <span className="text-slate-500 font-bold text-xs">SOC</span>;
    }
  };

  // Export current dataset to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Platforms', 'Media Type', 'Status', 'Date', 'Reach', 'Impressions', 'Likes', 'Comments', 'Shares', 'Engagement Rate'];
    const rows = sortedPosts.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.platforms.join('+'),
      p.mediaType,
      p.status,
      p.publishedAt || p.scheduledFor,
      p.metrics?.reach || 0,
      p.metrics?.impressions || 0,
      p.metrics?.likes || 0,
      p.metrics?.comments || 0,
      p.metrics?.shares || 0,
      `${p.metrics?.engagementRate || 0}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnivibe-analytics-${selectedPlatform}-${dateRangeDays}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock trend data points for SVG Chart
  const trendPoints = useMemo(() => {
    // 7 sample day intervals
    const labels = ['Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9'];
    const reachData = [32000, 48000, 65000, 89000, 74000, 118000, 142000];
    const impData = [45000, 68000, 92000, 124000, 105000, 168000, 198000];
    const data = chartMetric === 'reach' ? reachData : impData;
    const max = Math.max(...data) * 1.15;
    const min = Math.min(...data) * 0.85;

    const points = data.map((val, idx) => {
      const x = 40 + idx * 135;
      const y = 180 - ((val - min) / (max - min)) * 140;
      return { x, y, val, label: labels[idx] };
    });

    const pathD = points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
    const areaD = `${pathD} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`;

    return { points, pathD, areaD, max, min };
  }, [chartMetric]);

  return (
    <div className="space-y-6">
      {/* Top Header: Title, AI Callout, and Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Social Media Analytics & Feeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time cross-platform aggregated metrics, engagement velocity, and content intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Strategy recommendation CTA */}
          <button
            onClick={onNavigateToAI}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Insights Playbook</span>
          </button>

          {/* Date range filter segmented buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            {[
              { label: '7D', days: 7 },
              { label: '30D', days: 30 },
              { label: '90D', days: 90 },
              { label: 'All', days: 0 }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setDateRangeDays(item.days)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  dateRangeDays === item.days
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            title="Export filtered dataset to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            selectedPlatform === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>All Platforms (Cross-Network)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-current">
            {platformAccounts.filter((p) => p.connected).length} active
          </span>
        </button>

        {platformAccounts.map((account) => (
          <button
            key={account.platform}
            onClick={() => setSelectedPlatform(account.platform)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedPlatform === account.platform
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {getPlatformIcon(account.platform)}
            </div>
            <span className="capitalize">{account.platform}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {(account.followers / 1000).toFixed(0)}k
            </span>
          </button>
        ))}
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* Total Reach */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Reach</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {aggregateMetrics.totalReach > 0 ? (aggregateMetrics.totalReach / 1000).toFixed(1) + 'k' : '—'}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs previous period</span>
          </div>
        </div>

        {/* Blended Engagement Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg Engagement Rate</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {aggregateMetrics.avgEngagementRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Industry benchmark: <span className="font-semibold text-slate-700">3.8%</span>
          </div>
        </div>

        {/* Total Impressions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Impressions</span>
            <BarChart2 className="w-4 h-4 text-violet-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {aggregateMetrics.totalImpressions > 0 ? (aggregateMetrics.totalImpressions / 1000).toFixed(1) + 'k' : '—'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Across {aggregateMetrics.totalPosts} tracked posts
          </div>
        </div>

        {/* Cross-Platform Follower Base */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Audience</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {(totalFollowers / 1000).toFixed(1)}k
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            +11.2% net audience surge
          </div>
        </div>

        {/* Outperformer Posts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Outperforming Posts</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {aggregateMetrics.outperformerCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            &gt;1.15x engagement avg
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: SVG Trend Curve & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Audience Engagement Velocity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily organic reach and impression distribution over time
              </p>
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-xs font-medium text-slate-600">
              <button
                onClick={() => setChartMetric('reach')}
                className={`px-2 py-1 rounded transition-colors ${
                  chartMetric === 'reach' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
                }`}
              >
                Reach
              </button>
              <button
                onClick={() => setChartMetric('impressions')}
                className={`px-2 py-1 rounded transition-colors ${
                  chartMetric === 'impressions' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
                }`}
              >
                Impressions
              </button>
            </div>
          </div>

          {/* SVG Area & Line Chart */}
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 900 220" className="w-full h-48 select-none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="30" y1="40" x2="880" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="30" y1="90" x2="880" y2="90" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="30" y1="140" x2="880" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="30" y1="190" x2="880" y2="190" stroke="#e2e8f0" />

              {/* Area fill */}
              <path d={trendPoints.areaD} fill="url(#chartGradient)" />

              {/* Line path */}
              <path d={trendPoints.pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data points */}
              {trendPoints.points.map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                  <text x={pt.x} y="210" textAnchor="middle" fontSize="11" fill="#64748b">
                    {pt.label}
                  </text>
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">
                    {(pt.val / 1000).toFixed(0)}k
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Content Format Affinity Bar Comparison */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Format Performance Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Average engagement rate generated per media type
            </p>

            <div className="mt-4 space-y-3.5">
              {[
                { format: 'Vertical Reels (9:16)', rate: 12.8, count: 5, color: 'bg-indigo-600' },
                { format: 'YouTube Shorts', rate: 9.6, count: 3, color: 'bg-red-500' },
                { format: 'Carousels / Slides', rate: 9.4, count: 4, color: 'bg-violet-600' },
                { format: 'Longform Video', rate: 7.2, count: 2, color: 'bg-blue-600' },
                { format: 'Static Photo Post', rate: 3.4, count: 2, color: 'bg-slate-400' }
              ].map((item) => (
                <div key={item.format}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{item.format}</span>
                    <span className="font-semibold text-slate-900">{item.rate}% ER</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${(item.rate / 14) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>AI Recommendation:</span>
            <span className="text-indigo-600 font-semibold cursor-pointer" onClick={onNavigateToAI}>
              Increase Reels by +35% →
            </span>
          </div>
        </div>
      </div>

      {/* Content Explorer Section: Filters, Sorting, and View Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Explorer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Tracked Content Library
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by {sortField} ({sortOrder === 'desc' ? 'highest first' : 'lowest first'}) · {sortedPosts.length} posts matching filters
              </p>
            </div>

            {/* View Mode Toggle & Sort Control */}
            <div className="flex items-center gap-2">
              {/* Sort selector dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="engagementRate">Engagement Rate</option>
                  <option value="reach">Reach</option>
                  <option value="impressions">Impressions</option>
                  <option value="likes">Likes</option>
                  <option value="comments">Comments</option>
                  <option value="shares">Shares</option>
                  <option value="scheduledFor">Date Published</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="ml-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                  title="Toggle Ascending / Descending"
                >
                  {sortOrder === 'desc' ? 'DESC' : 'ASC'}
                </button>
              </div>

              {/* View switcher buttons */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-slate-600">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search & Sub-filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search caption, title, or tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Media Type filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">Format:</span>
              <select
                value={mediaTypeFilter}
                onChange={(e) => setMediaTypeFilter(e.target.value as MediaType | 'all')}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="all">All Formats</option>
                <option value="reel">Reels (9:16)</option>
                <option value="carousel">Carousels</option>
                <option value="short">Shorts</option>
                <option value="video">Videos</option>
                <option value="post">Single Posts</option>
                <option value="thread">Threads</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="review">In Review</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Display: Table or Grid */}
        {sortedPosts.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No content matches your filters</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search query or date range.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Content Title & Caption</th>
                  <th className="py-3 px-3">Platforms</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3 text-right">Reach</th>
                  <th className="py-3 px-3 text-right">Impressions</th>
                  <th className="py-3 px-3 text-right">Eng. Rate</th>
                  <th className="py-3 px-3 text-right">Likes</th>
                  <th className="py-3 px-3 text-right">Comments</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        {post.thumbnailUrl && (
                          <img
                            src={post.thumbnailUrl}
                            alt=""
                            className="w-9 h-9 rounded-md object-cover flex-shrink-0 border border-slate-200"
                          />
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">{post.title}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{post.caption}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {post.platforms.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold"
                          >
                            {getPlatformIcon(p)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 capitalize">
                      {post.mediaType}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      {post.metrics ? post.metrics.reach.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      {post.metrics ? post.metrics.impressions.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-indigo-600">
                      {post.metrics ? `${post.metrics.engagementRate}%` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      {post.metrics ? post.metrics.likes.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      {post.metrics ? post.metrics.comments.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : post.status === 'scheduled'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : post.status === 'review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  {post.thumbnailUrl && (
                    <img
                      src={post.thumbnailUrl}
                      alt=""
                      className="w-full h-36 rounded-lg object-cover mb-3 border border-slate-200"
                    />
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="capitalize font-medium text-slate-700">{post.mediaType}</span>
                    <span className="capitalize">{post.status}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {post.caption}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {post.platforms.map((p) => (
                      <span key={p} className="font-bold">{getPlatformIcon(p)}</span>
                    ))}
                  </div>
                  {post.metrics ? (
                    <div className="text-right">
                      <span className="font-bold text-indigo-600">{post.metrics.engagementRate}% ER</span>
                      <span className="text-slate-400 mx-1">·</span>
                      <span className="text-slate-600">{(post.metrics.reach / 1000).toFixed(0)}k reach</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Scheduled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
