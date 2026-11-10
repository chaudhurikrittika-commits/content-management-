import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { PostItem, SocialPlatform, PostStatus } from '../types/index.ts';
import { getMonthCalendarDays, getWeekDays, formatISODate, CalendarDay } from '../utils/calendar.ts';

interface ContentCalendarProps {
  posts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onOpenCreatePostForDate: (isoDate: string) => void;
  onNavigateToAI: () => void;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  posts,
  onSelectPost,
  onOpenCreatePostForDate,
  onNavigateToAI
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 10)); // Nov 10, 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (platformFilter !== 'all' && !p.platforms.includes(platformFilter)) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [posts, platformFilter, statusFilter]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month days
  const calendarDays = useMemo(() => {
    return getMonthCalendarDays(year, month, filteredPosts);
  }, [year, month, filteredPosts]);

  // Week days
  const weekDays = useMemo(() => {
    return getWeekDays(currentDate, filteredPosts);
  }, [currentDate, filteredPosts]);

  // Agenda posts sorted by scheduled date
  const agendaPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    });
  }, [filteredPosts]);

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 10, 10));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getPlatformLabel = (p: SocialPlatform) => {
    switch (p) {
      case 'instagram': return 'IG';
      case 'facebook': return 'FB';
      case 'youtube': return 'YT';
      case 'tiktok': return 'TT';
      case 'linkedin': return 'IN';
      case 'x': return 'X';
      default: return p;
    }
  };

  return (
    <div className="space-y-5">
      {/* Calendar Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            <span>Content Publishing Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Plan, schedule, and cross-publish content across Instagram, Facebook, TikTok, YouTube & LinkedIn.
          </p>
        </div>

        {/* View Mode & Quick Create */}
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            {(['month', 'week', 'agenda'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenCreatePostForDate(formatISODate(currentDate))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Navigation & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-base font-bold text-slate-900">
            {monthNames[month]} {year}
          </span>

          <button
            onClick={handleToday}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as SocialPlatform | 'all')}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="review">In Review</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 text-center py-2.5 bg-slate-50/80 text-xs font-semibold text-slate-600">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[540px]">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                onClick={() => onOpenCreatePostForDate(day.isoDate)}
                className={`p-2 min-h-[110px] sm:min-h-[125px] flex flex-col justify-between transition-colors group cursor-pointer ${
                  day.isCurrentMonth ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/40 text-slate-400'
                } ${day.isToday ? 'bg-indigo-50/30' : ''}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                      day.isToday
                        ? 'bg-indigo-600 text-white'
                        : day.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreatePostForDate(day.isoDate);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 transition-opacity"
                    title={`Schedule for ${day.isoDate}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Posts List */}
                <div className="mt-1.5 space-y-1 overflow-y-auto max-h-[85px] scrollbar-none">
                  {day.posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPost(post);
                      }}
                      className={`px-1.5 py-1 rounded text-[11px] font-medium truncate flex items-center justify-between border cursor-pointer ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : post.status === 'scheduled'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-1 truncate mr-1">
                        <span className="font-bold text-[9px] uppercase px-1 rounded bg-white/70">
                          {getPlatformLabel(post.platforms[0])}
                        </span>
                        <span className="truncate">{post.title}</span>
                      </div>
                      {post.collabId && (
                        <span className="text-[9px] text-indigo-700 font-bold" title="Collab Deliverable">★</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 text-right mt-1">
                  {day.posts.length > 0 && `${day.posts.length} item${day.posts.length > 1 ? 's' : ''}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 py-3 bg-slate-50/80 text-center text-xs">
            {weekDays.map((d, i) => (
              <div key={i} className="space-y-1">
                <span className="text-slate-500 font-medium">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.date.getDay()]}
                </span>
                <div
                  className={`mx-auto w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${
                    d.isToday ? 'bg-indigo-600 text-white' : 'text-slate-800'
                  }`}
                >
                  {d.dayNumber}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[400px] p-2">
            {weekDays.map((d, i) => (
              <div
                key={i}
                onClick={() => onOpenCreatePostForDate(d.isoDate)}
                className="p-1 space-y-2 cursor-pointer hover:bg-slate-50/50"
              >
                {d.posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPost(post);
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-xs text-xs space-y-1 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="capitalize font-bold text-slate-800">{post.mediaType}</span>
                      <span>{post.status}</span>
                    </div>
                    <div className="font-semibold text-slate-900 line-clamp-2">{post.title}</div>
                    <div className="flex items-center gap-1 pt-1 text-[10px] text-slate-500">
                      {post.platforms.map((p) => (
                        <span key={p} className="font-bold">{getPlatformLabel(p)}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agenda View */}
      {viewMode === 'agenda' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 font-semibold text-xs text-slate-700">
            Upcoming Chronological Content Queue ({agendaPosts.length} items)
          </div>
          {agendaPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-900">{post.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                      {post.mediaType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{post.caption}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <div className="font-semibold text-slate-900">
                    {new Date(post.scheduledFor).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(post.scheduledFor).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    post.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
