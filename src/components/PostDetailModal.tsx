import React from 'react';
import {
  X,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointer,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PostItem, SocialPlatform } from '../types/index.ts';

interface PostDetailModalProps {
  post: PostItem | null;
  onClose: () => void;
  onUpdateStatus?: (postId: string, newStatus: any) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onUpdateStatus
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                {post.mediaType}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  post.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : post.status === 'scheduled'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {post.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{post.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview if available */}
        {post.thumbnailUrl && (
          <div className="relative rounded-xl overflow-hidden max-h-48 bg-slate-900 border border-slate-200">
            <img src={post.thumbnailUrl} alt="" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Caption */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
          {post.caption}
        </div>

        {/* Analytics Breakdown */}
        {post.metrics ? (
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Performance Analytics Breakdown
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg">
                <div className="text-[10px] text-slate-500">Eng. Rate</div>
                <div className="font-extrabold text-indigo-700 text-base">{post.metrics.engagementRate}%</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500">Reach</div>
                <div className="font-bold text-slate-900">{post.metrics.reach.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500">Likes</div>
                <div className="font-bold text-slate-900">{post.metrics.likes.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500">Comments</div>
                <div className="font-bold text-slate-900">{post.metrics.comments.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500">Shares</div>
                <div className="font-semibold text-slate-800">{post.metrics.shares.toLocaleString()}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500">Saves</div>
                <div className="font-semibold text-slate-800">{post.metrics.saves.toLocaleString()}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500">Link Clicks</div>
                <div className="font-semibold text-slate-800">{post.metrics.clicks.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
            Scheduled for {new Date(post.scheduledFor).toLocaleString()}. Analytics will sync automatically post-publishing.
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img src={post.createdBy.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span>Created by {post.createdBy.name}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
