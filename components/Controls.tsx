
import React, { useMemo } from 'react';
import type { UserInputs, Platform, Format, AspectRatio, Playbook } from '../types';
import { PLAYBOOKS } from '../types';
import { SparklesIcon, ChevronDownIcon, LightBulbIcon, RocketLaunchIcon } from './icons';

interface ControlsProps {
  userInputs: UserInputs;
  setUserInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const platformFormats: Record<Platform, Format[]> = {
  Instagram: ['Carousel', 'Story', 'Video Script', 'Post'],
  TikTok: ['Video Script'],
  LinkedIn: ['Carousel', 'Post', 'Thread'],
  'Twitter/X': ['Thread', 'Post'],
  YouTube: ['Video Script'],
};

const CustomSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}> = ({ id, label, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative mt-1">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="appearance-none w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
    </div>
  </div>
);

const ColorInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, label, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative mt-1 flex items-center bg-slate-50 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-orange/50 focus-within:border-brand-orange">
      <div className="pl-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 p-0 border-none rounded-full cursor-pointer bg-transparent"
          aria-label={`${label} color picker`}
        />
      </div>
      <input
        type="text"
        id={id}
        value={value.toUpperCase()}
        onChange={(e) => {
          const newValue = e.target.value;
          if (/^#[0-9A-F]{0,6}$/i.test(newValue)) {
            onChange(newValue);
          }
        }}
        onBlur={(e) => {
          const finalValue = e.target.value.padEnd(7, '0');
          onChange(finalValue);
        }}
        className="w-full bg-transparent border-none py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-0"
        maxLength={7}
      />
    </div>
  </div>
);


export const Controls: React.FC<ControlsProps> = ({ userInputs, setUserInputs, onGenerate, isLoading }) => {
  
  const selectedPlaybook = useMemo(() => {
    return PLAYBOOKS.find(p => p.id === userInputs.playbookId) || PLAYBOOKS[0];
  }, [userInputs.playbookId]);

  const handleInputChange = <K extends keyof UserInputs>(
    field: K,
    value: UserInputs[K]
  ) => {
    setUserInputs(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePlaybookInputChange = (inputId: string, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      playbookInputs: {
        ...prev.playbookInputs,
        [inputId]: value,
      },
    }));
  };

  const handlePlaybookChange = (playbookId: string) => {
    const newPlaybook = PLAYBOOKS.find(p => p.id === playbookId);
    if (newPlaybook) {
      // Reset playbook inputs to default empty strings for the new playbook
      const newPlaybookInputs = newPlaybook.inputs.reduce((acc, input) => {
        acc[input.id] = '';
        return acc;
      }, {} as Record<string, string>);

      setUserInputs(prev => ({
        ...prev,
        playbookId: playbookId,
        playbookInputs: newPlaybookInputs,
      }));
    }
  };

  const availableFormats = useMemo(() => {
    return platformFormats[userInputs.platform];
  }, [userInputs.platform]);

  React.useEffect(() => {
    if (!availableFormats.includes(userInputs.format)) {
      handleInputChange('format', availableFormats[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableFormats, userInputs.format]);

  const handleFormatChange = (newFormat: Format) => {
    handleInputChange('format', newFormat);
    const newAspectRatio: AspectRatio = (newFormat === 'Story' || newFormat === 'Video Script') ? '9:16' : '1:1';
    handleInputChange('aspectRatio', newAspectRatio);
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
        case 'Ideation': return <SparklesIcon className="w-4 h-4 text-slate-500" />;
        case 'Virality': return <RocketLaunchIcon className="w-4 h-4 text-slate-500" />;
        case 'Creativity': return <LightBulbIcon className="w-4 h-4 text-slate-500" />;
        default: return null;
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Viral Content</h2>
      
       <div>
        <label htmlFor="playbook" className="block text-sm font-semibold text-slate-700">Content Playbook</label>
        <div className="relative mt-1">
          <select
            id="playbook"
            value={userInputs.playbookId}
            onChange={e => handlePlaybookChange(e.target.value)}
            className="appearance-none w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
          >
            {PLAYBOOKS.map(playbook => (
              <option key={playbook.id} value={playbook.id}>
                {playbook.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <p className="mt-2 text-xs text-slate-500">{selectedPlaybook.description}</p>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-6">
        {selectedPlaybook.inputs.map(input => (
           <div key={input.id}>
             <label htmlFor={input.id} className="block text-sm font-semibold text-slate-700">{input.label}</label>
             {input.type === 'textarea' ? (
                <textarea 
                  id={input.id} 
                  rows={3} 
                  value={userInputs.playbookInputs[input.id] || ''} 
                  onChange={e => handlePlaybookInputChange(input.id, e.target.value)} 
                  className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-lg p-4 shadow-sm sm:text-sm focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange" 
                  placeholder={input.placeholder}
                />
             ) : (
                <input 
                  type="text" 
                  id={input.id} 
                  value={userInputs.playbookInputs[input.id] || ''} 
                  onChange={e => handlePlaybookInputChange(input.id, e.target.value)} 
                  className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 shadow-sm sm:text-sm focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange" 
                  placeholder={input.placeholder}
                />
             )}
           </div>
        ))}
      </div>
      
      <div className="border-t border-slate-200 pt-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-700">Output Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect id="platform" label="Platform" value={userInputs.platform} onChange={e => handleInputChange('platform', e.target.value as UserInputs['platform'])}>
              {Object.keys(platformFormats).map(p => <option key={p}>{p}</option>)}
            </CustomSelect>
            
            <CustomSelect id="format" label="Format" value={userInputs.format} onChange={e => handleFormatChange(e.target.value as Format)}>
              {availableFormats.map(f => <option key={f}>{f}</option>)}
            </CustomSelect>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect id="tone" label="Tone" value={userInputs.tone} onChange={e => handleInputChange('tone', e.target.value as UserInputs['tone'])}>
              <option>Bold</option>
              <option>Friendly</option>
              <option>Inspiring</option>
              <option>Storytelling</option>
              <option>Professional</option>
            </CustomSelect>
            
            <CustomSelect id="goal" label="Goal" value={userInputs.goal} onChange={e => handleInputChange('goal', e.target.value as UserInputs['goal'])}>
              <option>Virality</option>
              <option>Engagement</option>
              <option>Lead Generation</option>
              <option>Sales</option>
            </CustomSelect>
          </div>
          {(userInputs.format === 'Carousel' || userInputs.format === 'Thread' || userInputs.format === 'Story') && (
            <div>
              <label htmlFor="slideCount" className="block text-sm font-semibold text-slate-700">Number of Parts</label>
              <input type="number" id="slideCount" value={userInputs.slideCount} onChange={e => handleInputChange('slideCount', parseInt(e.target.value, 10))} min="3" max="10" className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 shadow-sm sm:text-sm focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange" />
            </div>
          )}
      </div>

      <div className="border-t border-slate-200 pt-6 space-y-4">
         <h3 className="text-base font-semibold text-slate-700">Branding</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <ColorInput id="titleColor" label="Title Color" value={userInputs.titleColor} onChange={v => handleInputChange('titleColor', v)} />
           <ColorInput id="textColor" label="Text Color" value={userInputs.textColor} onChange={v => handleInputChange('textColor', v)} />
           <ColorInput id="highlightColor" label="Highlight Color" value={userInputs.highlightColor} onChange={v => handleInputChange('highlightColor', v)} />
         </div>
          <div>
            <label htmlFor="watermark" className="block text-sm font-semibold text-slate-700">Watermark (optional)</label>
            <input type="text" id="watermark" value={userInputs.watermark || ''} onChange={e => handleInputChange('watermark', e.target.value)} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 shadow-sm sm:text-sm focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange" placeholder="@yourhandle" />
          </div>
      </div>
      
      <button onClick={onGenerate} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 text-brand-orange" />
            Generate Content
          </>
        )}
      </button>
    </div>
  );
};
