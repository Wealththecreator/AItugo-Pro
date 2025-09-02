
import React from 'react';
import type { ContentPart as PartData } from '../types';
import { ChevronRightIcon } from './icons';

interface SlideProps {
  partData: PartData;
  partNumber: number;
  totalParts: number;
  watermark?: string;
  textColor: string;
  highlightColor: string;
  titleColor: string;
}

const HighlightedContent: React.FC<{ content: string; highlight?: string; textColor: string; highlightColor: string; }> = ({ content, highlight, textColor, highlightColor }) => {
  const pStyle = { color: textColor };
  const spanStyle = { color: highlightColor };

  if (!highlight || !content.includes(highlight)) {
    return <p className="text-xl md:text-2xl leading-relaxed" style={pStyle}>{content}</p>;
  }

  const parts = content.split(highlight);
  return (
    <p className="text-xl md:text-2xl leading-relaxed" style={pStyle}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="font-bold" style={spanStyle}>
              {highlight}
            </span>
          )}
        </React.Fragment>
      ))}
    </p>
  );
};

export const Slide: React.FC<SlideProps> = ({ partData, partNumber, totalParts, watermark, textColor, highlightColor, titleColor }) => {
  const isCover = partNumber === 1;
  const isCTA = partNumber === totalParts;

  return (
    <div className="w-full h-full bg-white flex flex-col p-10 md:p-14 text-left relative overflow-hidden rounded-xl">
      
      {!isCover && (
          <div className="absolute top-8 right-0 h-2 w-20" style={{ backgroundColor: highlightColor }}></div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center z-10 h-8">
        <div className="font-bold text-sm h-5 flex items-center" style={{color: textColor}}>
          {watermark}
        </div>
        <div className="text-sm font-semibold text-slate-400">
          {partNumber} / {totalParts}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-4 z-10">
        {isCover ? (
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 leading-none" style={{ color: titleColor }}>{partData.title}</h1>
            <p className="text-xl md:text-2xl" style={{ color: textColor }}>{partData.body}</p>
          </div>
        ) : isCTA ? (
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 leading-tight" style={{ color: titleColor }}>{partData.title}</h2>
            <p className="text-2xl md:text-3xl" style={{ color: textColor }}>{partData.body}</p>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: titleColor }}>{partData.title}</h2>
            <HighlightedContent content={partData.body} highlight={partData.highlight} textColor={textColor} highlightColor={highlightColor} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-8 flex items-center justify-start z-10">
        {!isCTA && (
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-xs">
                <span>SWIPE</span>
                <ChevronRightIcon className="w-4 h-4"/>
            </div>
        )}
      </footer>
    </div>
  );
};
