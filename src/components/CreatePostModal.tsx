import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Tag,
  Check,
  X,
  Image as ImageIcon,
  Share2,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { PostItem, SocialPlatform, MediaType, PostStatus, UserProfile } from '../types/index.ts';

interface CreatePostModalProps {
  initialDate?: string;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (post: Omit<PostItem, 'id'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  initialDate,
  currentUser,
  isOpen,
  onClose,
  onSavePost
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram', 'facebook']);
  const [mediaType, setMediaType] = useState<MediaType>('reel');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [scheduledDate, setScheduledDate] = useState(initialDate || '2026-11-15');
  const [scheduledTime, setScheduledTime] = useState('18:30');
  const [tagsInput, setTagsInput] = useState('productivity, ai, creator');
  const [status, setStatus] = useState<PostStatus>('scheduled');
  const [isCollabPost, setIsCollabPost] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestedHooks, setSuggestedHooks] = useState<string[]>([]);

  // Toggle platform selection
  const handleTogglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  // AI Hook & Caption Assistant
  const handleAIAssist = async () => {
    if (!title.trim()) return;
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/ai/optimize-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          draftCaption: caption,
          platforms: selectedPlatforms,
          mediaType
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSuggestedHooks(json.data.hooks || []);
        if (json.data.optimizedCaption) {
          setCaption(json.data.optimizedCaption);
        }
        if (json.data.recommendedHashtags) {
          setTagsInput(json.data.recommendedHashtags.join(', ').replace(/#/g, ''));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const scheduledIso = `${scheduledDate}T${scheduledTime}:00Z`;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSavePost({
      title: title.trim(),
      caption: caption.trim(),
      platforms: selectedPlatforms,
      mediaType,
      thumbnailUrl,
      scheduledFor: scheduledIso,
      status,
      tags,
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    });

    onClose();
  };

  const platformsList: { id: SocialPlatform; name: string }[] = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'x', name: 'X / Twitter' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create & Schedule Content</h2>
            <p className="text-xs text-slate-500">Cross-publish and queue content for all connected social feeds.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Platforms */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Target Networks (Multi-Publishing)
            </label>
            <div className="flex flex-wrap gap-2">
              {platformsList.map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleTogglePlatform(p.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & AI Assist */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Post Concept / Working Title</label>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={!title.trim() || isOptimizing}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isOptimizing ? 'Optimizing...' : 'Generate AI Hooks & Caption'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 AI Video Prompts That Boost Retention by 40%"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Suggested Hooks Pill Selector */}
          {suggestedHooks.length > 0 && (
            <div className="p-3 bg-violet-50/70 border border-violet-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-violet-900 block">
                Select an AI Viral Hook:
              </span>
              <div className="space-y-1.5">
                {suggestedHooks.map((hook, i) => (
                  <div
                    key={i}
                    onClick={() => setCaption(`${hook}\n\n${caption}`)}
                    className="p-2 bg-white rounded-lg border border-violet-100 text-violet-950 hover:bg-violet-100/50 cursor-pointer font-medium text-[11px] transition-colors"
                  >
                    Hook {i + 1}: "{hook}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Content Caption & Story</label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write or refine caption..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Format & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Content Format</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="reel">Vertical Reel (9:16)</option>
                <option value="carousel">Multi-Slide Carousel</option>
                <option value="short">YouTube Short</option>
                <option value="video">Longform Video</option>
                <option value="post">Single Image Post</option>
                <option value="thread">Text Thread</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="scheduled">Scheduled</option>
                <option value="review">Submit for Review</option>
                <option value="draft">Save as Draft</option>
              </select>
            </div>
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Publish Date</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
              </input>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Publish Time</label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Media preview thumbnail */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Media Preview Image URL</label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
            >
              Confirm & Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
