import React from 'react';
import type { PostAnalysis } from '../types';
import { ChartBarIcon, LightBulbIcon, SparklesIcon, ChatBubbleLeftRightIcon, ArrowTrendingUpIcon, BeakerIcon } from './icons';

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 54; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;
    
    let color = 'text-green-500';
    if (score < 75) color = 'text-yellow-500';
    if (score < 50) color = 'text-brand-orange';
    if (score < 25) color = 'text-red-500';

    return (
        <div className="relative w-44 h-44">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFB800" />
                        <stop offset="100%" stopColor="#FF7A00" />
                    </linearGradient>
                </defs>
                <circle className="text-slate-200" strokeWidth="12" stroke="currentColor" fill="transparent" r="54" cx="60" cy="60" />
                <circle
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r="54"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-slate-800">
                <span className="text-5xl font-black tracking-tighter">{score}</span>
                <span className="text-sm font-semibold text-slate-500 -mt-1">/ 100</span>
            </div>
        </div>
    );
};

const AnalysisCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-3 text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

const SentimentBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="grid grid-cols-6 items-center gap-4">
        <span className="col-span-1 text-xs font-semibold text-slate-600">{label}</span>
        <div className="col-span-4 bg-slate-100 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%`, transition: 'width 0.5s ease-out' }}></div>
        </div>
        <span className="col-span-1 text-right text-xs font-bold text-slate-800">{value}%</span>
    </div>
);


export const AnalysisViewer: React.FC<{ analysis: PostAnalysis }> = ({ analysis }) => {
    const { viralPotentialScore, hookAnalysis, contentBreakdown, audienceSentiment, growthOpportunities, xFactor } = analysis;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Viral Potential Score</h2>
                <div className="flex justify-center my-4">
                    <ScoreCircle score={viralPotentialScore.score} />
                </div>
                <p className="text-slate-600 max-w-xl mx-auto">{viralPotentialScore.justification}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalysisCard title="Hook Analysis" icon={<BeakerIcon className="w-7 h-7 text-brand-orange" />}>
                   <p><strong className="font-semibold text-slate-800">Effectiveness:</strong> {hookAnalysis.effectiveness}</p>
                   <p><strong className="font-semibold text-slate-800">Feedback:</strong> {hookAnalysis.feedback}</p>
                   <p><strong className="font-semibold text-slate-800">Suggestion:</strong> "{hookAnalysis.suggestion}"</p>
                </AnalysisCard>

                <AnalysisCard title="Audience Sentiment" icon={<ChatBubbleLeftRightIcon className="w-7 h-7 text-brand-orange" />}>
                   <p className="mb-4">{audienceSentiment.summary}</p>
                   <div className="space-y-2">
                       <SentimentBar label="Positive" value={audienceSentiment.positive} color="bg-green-500" />
                       <SentimentBar label="Neutral" value={audienceSentiment.neutral} color="bg-yellow-400" />
                       <SentimentBar label="Negative" value={audienceSentiment.negative} color="bg-red-500" />
                       <SentimentBar label="Questions" value={audienceSentiment.questions} color="bg-sky-500" />
                   </div>
                </AnalysisCard>
            </div>
            
            <AnalysisCard title="Content Breakdown" icon={<ChartBarIcon className="w-7 h-7 text-brand-orange" />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Storytelling</h4>
                        <p>{contentBreakdown.storytelling}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Value Proposition</h4>
                        <p>{contentBreakdown.valueProposition}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Call to Action</h4>
                        <p>{contentBreakdown.callToAction}</p>
                    </div>
                </div>
            </AnalysisCard>
            
             <AnalysisCard title="Growth Opportunities" icon={<ArrowTrendingUpIcon className="w-7 h-7 text-brand-orange" />}>
                <ul className="list-disc list-outside space-y-2 pl-4">
                    {growthOpportunities.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </AnalysisCard>

            <AnalysisCard title="The X-Factor" icon={<SparklesIcon className="w-7 h-7 text-brand-orange" />}>
               {xFactor.identified ? (
                   <p>{xFactor.description}</p>
               ) : (
                   <p className="text-slate-500">No distinct X-Factor identified. This is an area for improvement to make content more memorable and shareable.</p>
               )}
            </AnalysisCard>
        </div>
    );
};