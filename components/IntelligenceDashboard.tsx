import React, { useMemo, useState } from 'react';
import {
  intelligenceCategories,
  intelligenceSources,
  platformFilters,
  type IntelligenceCategory,
  type IntelligenceSource,
  type PlatformType,
} from '../data/aiIntelligenceSources';
import {
  ChartBarIcon,
  LightBulbIcon,
  SparklesIcon,
  TrendingUpIcon,
  FilterIcon,
  LinkIcon,
  LightningBoltIcon,
  GlobeIcon,
} from './icons';

const scoreToBadge = (score: number) => {
  if (score >= 88) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
  if (score >= 80) return 'bg-sky-500/20 text-sky-300 border border-sky-500/40';
  return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
};

const signalToGradient: Record<IntelligenceSource['signalStrength'], string> = {
  Dominant: 'from-emerald-500/30 to-emerald-400/20 text-emerald-100 border-emerald-500/40',
  Momentum: 'from-sky-500/30 to-sky-400/20 text-sky-100 border-sky-500/40',
  Emerging: 'from-amber-500/30 to-amber-400/20 text-amber-50 border-amber-500/40',
};

const SourceCard: React.FC<{ source: IntelligenceSource }> = ({ source }) => {
  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-lg shadow-slate-950/40">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
              signalToGradient[source.signalStrength]
            }`}>
              <LightningBoltIcon className="w-4 h-4" />
              {source.signalStrength} Signal
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${scoreToBadge(source.credibilityScore)}`}>
              Credibility {source.credibilityScore}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${scoreToBadge(source.impactScore)}`}>
              Impact {source.impactScore}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-slate-100 tracking-tight">
            <a href={source.url} target="_blank" rel="noreferrer" className="hover:text-brand-orange transition-colors inline-flex items-center gap-2">
              {source.name}
              <LinkIcon className="w-4 h-4" />
            </a>
          </h3>
          <p className="mt-2 text-slate-300 leading-relaxed">{source.description}</p>
        </div>
        <div className="min-w-[160px] space-y-2 text-sm text-slate-300 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Platform</p>
            <p className="font-semibold text-slate-100">{source.platformType}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Reach</p>
            <p className="font-semibold text-slate-100">{source.keySignals.reach}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Cadence</p>
            <p className="font-semibold text-slate-100">{source.keySignals.cadence}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Formats</p>
            <p>{source.keySignals.formats.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 text-sm text-slate-200">
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Audience Focus</p>
          <p className="leading-relaxed">{source.audienceFocus}</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Proof Points</p>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            {source.proofPoints.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Move Now</p>
          <p className="leading-relaxed">{source.callToAction}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-200 mb-2">Trending Signals</p>
          <ul className="space-y-1 list-disc list-inside text-emerald-100">
            {source.dataHighlights.trendingTopics.map(topic => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-sky-200 mb-2">Monetisation Plays</p>
          <ul className="space-y-1 list-disc list-inside text-sky-100">
            {source.dataHighlights.monetizationAngles.map(angle => (
              <li key={angle}>{angle}</li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-amber-200 mb-2">Creator Power Moves</p>
          <ul className="space-y-1 list-disc list-inside text-amber-100">
            {source.dataHighlights.creatorTakeaways.map(takeaway => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

export const IntelligenceDashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<IntelligenceCategory | 'All'>('All');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const togglePlatform = (platform: PlatformType) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(item => item !== platform) : [...prev, platform]
    );
  };

  const filteredSources = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return intelligenceSources.filter(source => {
      const matchesCategory =
        activeCategory === 'All' || source.categories.includes(activeCategory);
      const matchesPlatform =
        selectedPlatforms.length === 0 || selectedPlatforms.includes(source.platformType);
      const matchesSearch =
        search.length === 0 ||
        [
          source.name,
          source.description,
          source.audienceFocus,
          source.dataHighlights.trendingTopics.join(' '),
          source.dataHighlights.creatorTakeaways.join(' '),
          source.dataHighlights.monetizationAngles.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      return matchesCategory && matchesPlatform && matchesSearch;
    });
  }, [activeCategory, selectedPlatforms, searchTerm]);

  const topTopics = useMemo(() => {
    const counts = new Map<string, number>();
    filteredSources.forEach(source => {
      source.dataHighlights.trendingTopics.forEach(topic => {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [filteredSources]);

  const monetisationStacks = useMemo(() => {
    const stacks = new Map<string, Set<string>>();
    filteredSources.forEach(source => {
      source.dataHighlights.monetizationAngles.forEach(angle => {
        if (!stacks.has(angle)) {
          stacks.set(angle, new Set());
        }
        stacks.get(angle)?.add(source.name);
      });
    });
    return Array.from(stacks.entries())
      .sort((a, b) => (b[1].size === a[1].size ? a[0].localeCompare(b[0]) : b[1].size - a[1].size))
      .slice(0, 5);
  }, [filteredSources]);

  const actionPlaybooks = useMemo(() => {
    return filteredSources.map(source => ({
      name: source.name,
      action: source.callToAction,
      signals: source.signalStrength,
    }));
  }, [filteredSources]);

  const averageCredibility = useMemo(() => {
    if (filteredSources.length === 0) return 0;
    const total = filteredSources.reduce((sum, source) => sum + source.credibilityScore, 0);
    return Math.round(total / filteredSources.length);
  }, [filteredSources]);

  const averageImpact = useMemo(() => {
    if (filteredSources.length === 0) return 0;
    const total = filteredSources.reduce((sum, source) => sum + source.impactScore, 0);
    return Math.round(total / filteredSources.length);
  }, [filteredSources]);

  return (
    <div className="space-y-10">
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-slate-100 shadow-2xl shadow-slate-950/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange">
              <GlobeIcon className="w-4 h-4" />
              AITUGO INTELLIGENCE NETWORK
            </div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">
              Real-time AI growth intelligence built for creators & entrepreneurs
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Blend market-grade data, community sentiment, and monetisation-ready insights without leaving the AITugo universe. Use the filters to surface the highest-signal sources for your next offer, launch, or piece of thought leadership.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 w-full lg:w-[320px] space-y-4">
            <div className="flex items-center gap-3 text-emerald-200">
              <SparklesIcon className="w-6 h-6" />
              <p className="text-sm font-semibold uppercase tracking-wider">Signal Snapshot</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Sources in view</p>
                <p className="mt-1 text-2xl font-bold text-white">{filteredSources.length}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Avg. Credibility</p>
                <p className="mt-1 text-2xl font-bold text-white">{averageCredibility}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Avg. Impact</p>
                <p className="mt-1 text-2xl font-bold text-white">{averageImpact}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Active Filters</p>
                <p className="mt-1 text-2xl font-bold text-white">{selectedPlatforms.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-950/50">
            <div className="flex flex-wrap items-center gap-3">
              {intelligenceCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                    ${
                      activeCategory === category
                        ? 'bg-brand-orange text-white border-transparent shadow-lg shadow-brand-orange/30'
                        : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-600'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-[1.5fr_auto] gap-4">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Search signals, topics, revenue plays..."
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/60"
                />
                <FilterIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              </div>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSelectedPlatforms([]);
                  setSearchTerm('');
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-200 bg-slate-950/70 border border-slate-800 rounded-2xl hover:border-brand-orange/60 transition-all"
              >
                Reset Filters
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {platformFilters.map(platform => {
                const isActive = selectedPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/40'
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-600'
                      }
                    `}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {filteredSources.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center text-slate-300">
                <LightBulbIcon className="w-12 h-12 mx-auto text-brand-orange mb-4" />
                <p className="text-lg font-semibold">No sources match these filters yet.</p>
                <p className="mt-2 text-sm text-slate-400">
                  Try clearing a few filters or broaden your search query to uncover more intelligence signals.
                </p>
              </div>
            ) : (
              filteredSources.map(source => <SourceCard key={source.id} source={source} />)
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-950/40">
            <div className="flex items-center gap-3 text-slate-200">
              <TrendingUpIcon className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Trending Topic Heatmap</p>
            </div>
            <div className="space-y-3">
              {topTopics.length === 0 ? (
                <p className="text-slate-500 text-sm">Adjust filters to reveal trending topics.</p>
              ) : (
                topTopics.map(([topic, count]) => (
                  <div key={topic} className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
                    <span className="text-sm font-semibold text-slate-200">{topic}</span>
                    <span className="text-xs font-semibold text-brand-orange">{count} signals</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-950/40">
            <div className="flex items-center gap-3 text-slate-200">
              <ChartBarIcon className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Monetisation Stack Builder</p>
            </div>
            <div className="space-y-3">
              {monetisationStacks.length === 0 ? (
                <p className="text-slate-500 text-sm">Select a source category to map revenue-ready plays.</p>
              ) : (
                monetisationStacks.map(([angle, sources]) => (
                  <div key={angle} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-slate-100">{angle}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">Signals from {sources.size} sources</p>
                    <p className="mt-2 text-xs text-slate-400">Start by pairing with: {Array.from(sources).slice(0, 2).join(', ')}...</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-950/40">
            <div className="flex items-center gap-3 text-slate-200">
              <SparklesIcon className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Action Playbooks</p>
            </div>
            <div className="space-y-3">
              {actionPlaybooks.length === 0 ? (
                <p className="text-slate-500 text-sm">Add a source to unlock tailored actions.</p>
              ) : (
                actionPlaybooks.map(play => (
                  <div key={play.name} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-slate-100">{play.name}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Signal: {play.signals}</p>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">{play.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
