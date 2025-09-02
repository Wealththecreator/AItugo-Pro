
import React, { useState, useEffect } from 'react';
import type { ContentPart, AspectRatio } from '../types';
import { Slide } from './Slide';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CarouselViewerProps {
  parts: ContentPart[];
  aspectRatio: AspectRatio;
  watermark?: string;
  textColor: string;
  highlightColor: string;
  titleColor: string;
}

export const CarouselViewer: React.FC<CarouselViewerProps> = ({ parts, aspectRatio, watermark, textColor, highlightColor, titleColor }) => {
  const [currentPart, setCurrentPart] = useState(0);

  useEffect(() => {
    setCurrentPart(0);
  }, [parts]);

  const nextPart = () => {
    setCurrentPart(prev => (prev === parts.length - 1 ? 0 : prev + 1));
  };

  const prevPart = () => {
    setCurrentPart(prev => (prev === 0 ? parts.length - 1 : prev - 1));
  };
  
  if (!parts || parts.length === 0) {
    return null;
  }

  const aspectClass = aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[9/16]';

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 tracking-tight px-2 mb-4">Generated Content</h3>
      <div className="relative group">
        <div className={`w-full ${aspectClass} max-w-full mx-auto overflow-hidden rounded-xl relative bg-slate-100`}>
          {parts.map((part, index) => (
            <div
              key={part.partNumber}
              id={index === currentPart ? 'active-slide-container' : undefined}
              className={`slide-for-capture absolute inset-0 transition-opacity duration-300 ease-in-out ${index === currentPart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              data-part-index={index}
            >
              <Slide
                partData={part}
                partNumber={index + 1}
                totalParts={parts.length}
                watermark={watermark}
                textColor={textColor}
                highlightColor={highlightColor}
                titleColor={titleColor}
              />
            </div>
          ))}
        </div>
        
        {parts.length > 1 && (
          <>
            <button onClick={prevPart} aria-label="Previous Slide" className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-3 bg-white/70 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-orange opacity-0 group-hover:opacity-100">
              <ChevronLeftIcon className="w-6 h-6 text-slate-800" />
            </button>
            <button onClick={nextPart} aria-label="Next Slide" className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-3 bg-white/70 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-orange opacity-0 group-hover:opacity-100">
              <ChevronRightIcon className="w-6 h-6 text-slate-800" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
