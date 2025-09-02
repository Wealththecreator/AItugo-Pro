
import React from 'react';
import type { OptimizedPart } from '../types';
import { Slide } from './Slide';
import { CheckIcon } from './icons';

interface OptimizationViewerProps {
  parts: OptimizedPart[];
  onSelect: (part: OptimizedPart) => void;
  onCancel: () => void;
  textColor: string;
  highlightColor: string;
  titleColor: string;
}

const ScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
    let bgColor = 'bg-green-100';
    let textColor = 'text-green-800';
    
    if (score < 80) { bgColor = 'bg-yellow-100'; textColor = 'text-yellow-800'; }
    if (score < 60) { bgColor = 'bg-orange-100'; textColor = 'text-orange-800'; }
    if (score < 40) { bgColor = 'bg-red-100'; textColor = 'text-red-800'; }

    return (
        <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-14 h-14 rounded-full ${bgColor} border-2 border-white`}>
                <span className={`font-bold text-xl ${textColor}`}>{score}</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">Viral Score</span>
        </div>
    );
};

export const OptimizationViewer: React.FC<OptimizationViewerProps> = ({ parts, onSelect, onCancel, textColor, highlightColor, titleColor }) => {
  return (
    <div className="space-y-6">
      <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">A/B Test Your Hook</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Our AI analyzed your hook and generated powerful alternatives. Pick the one with the highest potential to stop the scroll.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parts.map((part, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4 flex flex-col">
            <div className="aspect-square w-full overflow-hidden rounded-xl border border-slate-100">
              <Slide 
                partData={part} 
                partNumber={1} 
                totalParts={1} 
                watermark="@yourhandle"
                textColor={textColor}
                highlightColor={highlightColor}
                titleColor={titleColor}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between p-2">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <ScoreIndicator score={part.viralScore} />
                        {index === 0 && <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ORIGINAL</span>}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                        <strong className="not-italic text-slate-800">Rationale:</strong> "{part.rationale}"
                    </p>
                </div>
                 <button 
                    onClick={() => onSelect(part)} 
                    className="w-full flex justify-center items-center gap-2 mt-4 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
                >
                    <CheckIcon className="w-5 h-5"/>
                    Select This Version
                </button>
            </div>
          </div>
        ))}
      </div>
       <div className="text-center">
        <button onClick={onCancel} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            Cancel and keep original
        </button>
      </div>
    </div>
  );
};