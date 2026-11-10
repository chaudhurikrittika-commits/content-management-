import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Flame,
  MessageSquare
} from 'lucide-react';
import { PostItem, PlatformAccount, AIStrategyResult, SocialPlatform } from '../types/index.ts';

interface AIStrategyLabProps {
  posts: PostItem[];
  platformAccounts: PlatformAccount[];
  onApplyPostIdea?: (title: string, caption: string, platform: SocialPlatform) => void;
}

export const AIStrategyLab: React.FC<AIStrategyLabProps> = ({
  posts,
  platformAccounts,
  onApplyPostIdea
}) => {
  const [niche, setNiche] = useState('Tech, AI & Creator Economy');
  const [goal, setGoal] = useState('engagement_growth');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [strategyData, setStrategyData] = useState<AIStrategyResult | null>(null);
  const [engineSource, setEngineSource] = useState<string>('gemini_3.8_flash');

  // Quick Optimizer state
  const [quickTitle, setQuickTitle] = useState('5 AI Tools that 10x your content output');
  const [quickPlatform, setQuickPlatform] = useState<SocialPlatform>('instagram');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<{
    hooks: string[];
    optimizedCaption: string;
    recommendedHashtags: string[];
    bestPostingSlot: string;
    predictedEngagementBoost: string;
  } | null>(null);

  // Fetch AI Strategy from server
  const handleGenerateStrategy = async () => {
    setIsLoading(true);
    try {
      const payload = {
        analyticsContext: {
          totalTrackedPosts: posts.length,
          topPosts: posts.slice(0, 5).map((p) => ({
            title: p.title,
            platforms: p.platforms,
            format: p.mediaType,
            engagementRate: p.metrics?.engagementRate,
            reach: p.metrics?.reach
          })),
          platforms: platformAccounts.map((a) => ({
            platform: a.platform,
            followers: a.followers,
            avgEngagementRate: a.metrics.avgEngagementRate,
            bestHours: a.metrics.bestPostingHours,
            topFormat: a.metrics.topContentFormat
          }))
        },
        niche,
        goal
      };

      const res = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success && json.data) {
        setStrategyData(json.data);
        setEngineSource(json.source || 'gemini_3.8_flash');
      }
    } catch (err) {
      console.error('Failed to fetch strategy:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount if no strategy loaded yet
  React.useEffect(() => {
    if (!strategyData) {
      handleGenerateStrategy();
    }
  }, []);

  // Quick Post Optimizer
  const handleOptimizeDraft = async () => {
    setOptimizing(true);
    try {
      const res = await fetch('/api/ai/optimize-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quickTitle,
          draftCaption: 'Here are the best tools every creator needs this year.',
          platforms: [quickPlatform],
          mediaType: 'reel'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setOptimizedResult(json.data);
      }
    } catch (err) {
      console.error('Failed to optimize post:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Engine Banner Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash AI Engine</span>
            <span className="text-white/40">·</span>
            <span className="text-white/80 font-normal">Personalized Strategy & Cross-Network Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Personalized Content Strategy Engine
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            OmniVibe's AI analyzes your past reach, audience retention, and anonymized top-performing benchmarks in your niche to deliver real-time publishing playbooks and virality hooks.
          </p>

          {/* Strategy Form Controls */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold block mb-1">
                Your Niche
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-400"
                placeholder="e.g. Tech & Productivity"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold block mb-1">
                Primary Growth Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/90 border border-white/20 rounded-lg text-xs text-white focus:outline-hidden focus:border-indigo-400"
              >
                <option value="engagement_growth">Boost Comment & Save Rates</option>
                <option value="virality_reach">Maximize Top-of-Funnel Viral Reach</option>
                <option value="paid_collabs">Attract High-Ticket Brand Sponsorships</option>
                <option value="community_building">Convert Followers to Loyal Community</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateStrategy}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Analyzing Metrics...' : 'Re-Run Strategy Audit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {isLoading && (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">
            Synthesizing Cross-Platform Performance...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Gemini is correlating Instagram Reel watch-times, Facebook reach spikes, and anonymized peer accounts to construct your custom roadmap.
          </p>
        </div>
      )}

      {strategyData && !isLoading && (
        <div className="space-y-6">
          {/* Executive Overview & Health Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Studio Health Score
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-indigo-600">
                    {strategyData.healthScore}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">/ 100</span>
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Top 12% in {niche}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Audited via {engineSource.replace(/_/g, ' ')}
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Executive Assessment
              </span>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {strategyData.executiveSummary}
              </p>
            </div>
          </div>

          {/* Section 1: Optimal Posting Times by Platform */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Optimal Posting Times Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmically determined peak engagement windows for each connected network
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategyData.optimalPostingTimes?.map((item) => (
                <div
                  key={item.platform}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider capitalize">
                        {item.platform}
                      </span>
                      <span className="text-[10px] text-indigo-700 font-semibold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                        Peak Yield
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      <div className="text-xs">
                        <span className="text-slate-500">Best Days: </span>
                        <span className="font-semibold text-slate-900">
                          {item.peakDays.join(', ')}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500">Hours: </span>
                        <span className="font-semibold text-indigo-600">
                          {item.peakHours.join(' · ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-3 italic leading-relaxed">
                      "{item.rationale}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Audience Content Type Affinity & Trending Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Formats Affinity */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Audience Format Affinity Score</span>
              </h3>

              <div className="mt-4 space-y-4">
                {strategyData.contentTypesAudienceAffinity?.map((format) => (
                  <div key={format.type} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-900 capitalize">
                        {format.type}
                      </span>
                      <span className="font-extrabold text-indigo-600">
                        {format.affinityScore}% Affinity
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${format.affinityScore}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {format.whyItWorks}
                    </p>

                    <div className="mt-2 text-[10px] text-slate-500">
                      Top networks: <span className="font-medium text-slate-700 capitalize">{format.bestPlatforms.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics & Viral Hooks */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Trending Topics & High-Velocity Hooks</span>
              </h3>

              <div className="mt-4 space-y-3.5">
                {strategyData.trendingTopics?.map((trend, idx) => (
                  <div key={trend.topic} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-slate-900">
                        {trend.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trend.trendVelocity === 'Spike'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : trend.trendVelocity === 'Rising'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {trend.trendVelocity}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-800 font-medium italic mt-2 border border-slate-100 flex items-center justify-between">
                      <span>"{trend.suggestedHook}"</span>
                      <button
                        onClick={() => handleCopy(trend.suggestedHook, `trend-${idx}`)}
                        className="ml-2 text-slate-400 hover:text-slate-700 flex-shrink-0"
                        title="Copy hook"
                      >
                        {copiedIndex === `trend-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500">
                      Best for: <span className="font-medium text-slate-700 capitalize">{trend.targetPlatforms.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Anonymized Peer Accounts Learnings & Engagement Tactics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Anonymized Peer Accounts Insights */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Anonymized Peer Benchmark Patterns</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ethical pattern recognition from top 1% accounts in your category
              </p>

              <div className="mt-4 space-y-3.5">
                {strategyData.anonymizedSimilarAccountsInsights?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block mb-1">
                      {item.accountType}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      <strong className="text-slate-800">Observed Pattern:</strong> {item.keyLearnings}
                    </p>
                    <div className="text-xs text-indigo-700 font-medium p-2 bg-indigo-50/80 rounded-md border border-indigo-100">
                      <strong>Recommended Adaptation:</strong> {item.recommendedTacticToAdopt}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Improvement Tactics & CTAs */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Immediate Engagement Improvement Tactics</span>
                </h3>

                <div className="mt-4 space-y-2.5">
                  {strategyData.engagementImprovementTactics?.map((tactic, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{tactic}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-900 block mb-2">
                    High-Converting Calls-to-Action (CTAs)
                  </span>
                  <div className="space-y-1.5">
                    {strategyData.highConvertingCTA?.map((cta, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        <span className="truncate mr-2 font-medium">"{cta}"</span>
                        <button
                          onClick={() => handleCopy(cta, `cta-${idx}`)}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy CTA"
                        >
                          {copiedIndex === `cta-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hook & Caption Optimizer */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Interactive Post & Hook Optimizer</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter a rough content concept to generate tailored virality hooks, formatted caption, and best posting slot.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. 5 AI tools that saved our content studio 15 hours"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={quickPlatform}
                  onChange={(e) => setQuickPlatform(e.target.value as SocialPlatform)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                </select>

                <button
                  onClick={handleOptimizeDraft}
                  disabled={optimizing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {optimizing ? 'Generating...' : 'Optimize'}
                </button>
              </div>
            </div>

            {optimizedResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    Recommended Viral Hooks:
                  </span>
                  <span className="text-indigo-600 font-bold">
                    {optimizedResult.predictedEngagementBoost}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {optimizedResult.hooks.map((hook, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-800 flex items-center justify-between"
                    >
                      <span>Hook {i + 1}: "{hook}"</span>
                      <button
                        onClick={() => handleCopy(hook, `opt-hook-${i}`)}
                        className="text-slate-400 hover:text-slate-700 ml-2"
                      >
                        {copiedIndex === `opt-hook-${i}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    Optimal publishing slot: <strong className="text-slate-900">{optimizedResult.bestPostingSlot}</strong>
                  </span>
                  <span className="text-indigo-600 font-medium">
                    {optimizedResult.recommendedHashtags.join(' ')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
