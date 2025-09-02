
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { CarouselViewer } from './components/CarouselViewer';
import { OutputActions } from './components/OutputActions';
import { Loader } from './components/Loader';
import { generateViralContent, analyzeContent, generateOptimizedHooks, generateVideo, getVideosOperation, API_KEY } from './services/geminiService';
import type { UserInputs, ViralContent, PostAnalysis, OptimizedPart, ContentPart } from './types';
import { SparklesIcon, ChartBarIcon, FilmIcon, DocumentTextIcon, WandIcon, VideoCameraIcon } from './components/icons';
import { AnalysisControls } from './components/AnalysisControls';
import { AnalysisViewer } from './components/AnalysisViewer';
import { OptimizationViewer } from './components/OptimizationViewer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

const TabButton: React.FC<{ name: string; isActive: boolean; onClick: () => void }> = ({ name, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative w-1/2 py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange
            ${isActive
                ? 'text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
    >
        {name}
    </button>
);


const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'create' | 'analyze'>('create');

  // State for 'Create' mode
  const [userInputs, setUserInputs] = useState<UserInputs>({
    platform: 'Instagram',
    playbookId: 'default-generator',
    playbookInputs: { topic: 'Why most diets fail' },
    tone: 'Bold',
    format: 'Carousel',
    goal: 'Engagement',
    slideCount: 7,
    aspectRatio: '1:1',
    watermark: '',
    textColor: '#1E293B',
    highlightColor: '#FF7A00',
    titleColor: '#0F172A',
  });
  const [viralContent, setViralContent] = useState<ViralContent | null>(null);
  
  // State for 'Analyze' mode
  const [analysisResult, setAnalysisResult] = useState<PostAnalysis | null>(null);

  // State for 'Optimization' flow
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedParts, setOptimizedParts] = useState<OptimizedPart[] | null>(null);

  // State for Video Generation flow
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoGenerationStatus, setVideoGenerationStatus] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  // Shared state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearResults = () => {
    setViralContent(null);
    setAnalysisResult(null);
    setOptimizedParts(null);
    setGeneratedVideoUrl(null);
    setError(null);
  }

  const handleModeChange = (mode: 'create' | 'analyze') => {
    setAppMode(mode);
    clearResults();
  }

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    clearResults();
    try {
      const result = await generateViralContent(userInputs);
      if (result) {
        setViralContent(result);
      } else {
        setError('Failed to generate content. The AI returned an unexpected response.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userInputs]);

  const handleAnalyze = useCallback(async (url: string) => {
    setIsLoading(true);
    clearResults();
    try {
      const result = await analyzeContent(url);
       if (result) {
        setAnalysisResult(result);
      } else {
        setError('Failed to analyze content. The AI returned an unexpected response.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStartOptimization = useCallback(async () => {
    if (!viralContent?.contentParts?.[0]) return;

    setIsOptimizing(true);
    setError(null);
    try {
      const result = await generateOptimizedHooks(viralContent.contentParts[0], userInputs);
      if (result) {
        setOptimizedParts(result);
      } else {
        setError('Failed to generate optimizations. The AI returned an unexpected response.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while optimizing.');
    } finally {
      setIsOptimizing(false);
    }
  }, [viralContent, userInputs]);

  const handleGenerateVideo = useCallback(async () => {
    if (!viralContent?.script) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setError(null);

    const videoStatuses = [
        "AI director is reviewing the script...",
        "Setting up the virtual cameras...",
        "Adjusting the lighting...",
        "Rendering the first few frames...",
        "This can take a few minutes...",
        "Adding special effects...",
        "Finalizing the audio...",
        "Polishing the final cut...",
    ];
    let statusIndex = 0;
    setVideoGenerationStatus(videoStatuses[statusIndex]);
    const statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % videoStatuses.length;
        setVideoGenerationStatus(videoStatuses[statusIndex]);
    }, 5000);

    try {
        const prompt = `Create a short, dynamic, visually engaging video for social media (like TikTok or Instagram Reels) based on the following script. The style should be modern and fast-paced to keep viewers engaged. Use stock footage and abstract animations where appropriate. \n\nSCRIPT:\n${viralContent.script}`;
        let operation = await generateVideo(prompt);

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await getVideosOperation(operation);
        }
        
        clearInterval(statusInterval);

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            setVideoGenerationStatus("Downloading video...");
            // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
            const response = await fetch(`${downloadLink}&key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`Failed to download video: ${response.statusText}`);
            }
            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);
        } else {
            throw new Error("Video generation completed, but no download link was provided.");
        }

    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred during video generation.');
        clearInterval(statusInterval);
    } finally {
        setIsGeneratingVideo(false);
        setVideoGenerationStatus('');
    }
  }, [viralContent]);
  
  const handleSelectOptimizedPart = (selectedPart: ContentPart) => {
    if (!viralContent?.contentParts) return;

    const newContentParts = [...viralContent.contentParts];
    newContentParts[0] = selectedPart;

    setViralContent({
      ...viralContent,
      contentParts: newContentParts,
    });
    setOptimizedParts(null); // Exit optimization view
  };

  const handleCancelOptimization = () => {
    setOptimizedParts(null);
  };

  const getFileName = () => {
    const inputs = userInputs.playbookInputs;
    const primaryInput = inputs.topic || inputs['YOUR NICHE'] || inputs['TRENDING TOPIC'] || 'ViralFlow_Content';
    return primaryInput.substring(0, 50).replace(/\s+/g, '_');
  }

  const handleDownloadPNG = async () => {
    const element = document.getElementById('active-slide-container');
    if (!element) {
      setError('Could not find the active slide to download.');
      return;
    }
    setIsDownloading(true);
    setError(null);
    try {
      const canvas = await html2canvas(element, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${getFileName()}_slide.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
      setError('Failed to create PNG. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const slideElements = document.querySelectorAll<HTMLDivElement>('.slide-for-capture');
    if (slideElements.length === 0) {
      setError('Could not find slides to download.');
      return;
    }
    setIsDownloading(true);
    setError(null);
    try {
      const sortedSlideElements = Array.from(slideElements).sort((a, b) => {
        const indexA = parseInt(a.dataset.partIndex || '0', 10);
        const indexB = parseInt(b.dataset.partIndex || '0', 10);
        return indexA - indexB;
      });

      const isSquare = userInputs.aspectRatio === '1:1';
      const pdfWidth = isSquare ? 810 : 810;
      const pdfHeight = isSquare ? 810 : 1440; // 1px = 0.75pt

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [pdfWidth, pdfHeight],
      });

      for (let i = 0; i < sortedSlideElements.length; i++) {
        const element = sortedSlideElements[i];
        const canvas = await html2canvas(element, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) {
          pdf.addPage([pdfWidth, pdfHeight], 'p');
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      pdf.save(`${getFileName()}.pdf`);
    } catch (e) {
      console.error(e);
      setError('Failed to create PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadZIP = async () => {
    const slideElements = document.querySelectorAll<HTMLDivElement>('.slide-for-capture');
    if (slideElements.length === 0 || !viralContent) {
      setError('Could not find slides or content to download.');
      return;
    }
    setIsDownloading(true);
    setError(null);
    try {
      const zip = new JSZip();
      
      const sortedSlideElements = Array.from(slideElements).sort((a, b) => {
        const indexA = parseInt(a.dataset.partIndex || '0', 10);
        const indexB = parseInt(b.dataset.partIndex || '0', 10);
        return indexA - indexB;
      });

      for (let i = 0; i < sortedSlideElements.length; i++) {
        const element = sortedSlideElements[i];
        const canvas = await html2canvas(element, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          zip.file(`slide_${i + 1}.png`, blob);
        }
      }

      if (viralContent.captions && viralContent.captions.length > 0) {
        zip.file('captions.txt', viralContent.captions.join('\n\n---\n\n'));
      }

      if (viralContent.hashtags && viralContent.hashtags.length > 0) {
        zip.file('hashtags.txt', viralContent.hashtags.map(h => `#${h.replace(/#/g, '')}`).join(' '));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `${getFileName()}.zip`;
      link.href = URL.createObjectURL(zipBlob);
      link.click();
      URL.revokeObjectURL(link.href);

    } catch (e) {
      console.error(e);
      setError('Failed to create ZIP file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };


  const renderCreateModeContent = () => {
    if (isLoading) {
      return <Loader message="Generating Virality..." subMessage="Our AI is crafting your masterpiece." />;
    }
    if (isOptimizing) {
       return <Loader message="Sparring with AI..." subMessage="Our virality expert is A/B testing your hook." />;
    }
    if (isGeneratingVideo) {
        return <Loader message="AI Director At Work" subMessage={videoGenerationStatus} />;
    }
    if (error) {
      return <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl"><p>{error}</p></div>;
    }
    if (optimizedParts) {
      return <OptimizationViewer 
        parts={optimizedParts} 
        onSelect={handleSelectOptimizedPart} 
        onCancel={handleCancelOptimization}
        textColor={userInputs.textColor}
        highlightColor={userInputs.highlightColor}
        titleColor={userInputs.titleColor}
      />;
    }
    if (viralContent) {
      const isOptimizable = userInputs.format === 'Carousel' || userInputs.format === 'Story' || userInputs.format === 'Thread';
      return (
        <div className="space-y-6">
          {viralContent.contentParts && (
            <>
              <CarouselViewer 
                parts={viralContent.contentParts} 
                aspectRatio={userInputs.aspectRatio} 
                watermark={userInputs.watermark}
                textColor={userInputs.textColor}
                highlightColor={userInputs.highlightColor}
                titleColor={userInputs.titleColor}
              />
              {isOptimizable && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
                   <button onClick={handleStartOptimization} className="flex w-full sm:w-auto sm:mx-auto justify-center items-center gap-2.5 py-2.5 px-6 rounded-lg text-base font-semibold text-white bg-gradient-to-br from-brand-orange to-orange-400 hover:from-brand-orange/90 hover:to-orange-400/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all duration-300 transform hover:scale-[1.03]">
                    <WandIcon className="w-5 h-5" />
                    A/B Test Your Hook
                   </button>
                </div>
              )}
            </>
          )}
          
          {viralContent.script && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <FilmIcon className="w-7 h-7 text-brand-orange" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Generated Video Script</h3>
              </div>
              {generatedVideoUrl ? (
                <div>
                  <video controls src={generatedVideoUrl} className="w-full rounded-lg" style={{aspectRatio: '9/16'}}>
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-xs text-slate-500 mt-2 text-center">Right-click the video to download.</p>
                </div>
              ) : (
                <>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {viralContent.script}
                  </pre>
                  <div className="mt-4 text-center">
                    <button onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="flex w-full sm:w-auto sm:mx-auto justify-center items-center gap-2.5 py-2.5 px-6 rounded-lg text-base font-semibold text-white bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700/90 hover:to-slate-900/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-all duration-300 transform hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed">
                      <VideoCameraIcon className="w-5 h-5" />
                      Generate Video with AI
                    </button>
                    <p className="text-xs text-slate-500 mt-2">This feature is experimental and may take several minutes.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {viralContent.postBody && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-7 h-7 text-brand-orange" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Generated Post</h3>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {viralContent.postBody}
              </div>
            </div>
          )}

          <OutputActions 
            captions={viralContent.captions}
            hashtags={viralContent.hashtags}
            nextTopicSuggestion={viralContent.nextTopicSuggestion}
            format={userInputs.format}
            isDownloading={isDownloading}
            onDownloadPNG={handleDownloadPNG}
            onDownloadPDF={handleDownloadPDF}
            onDownloadZIP={handleDownloadZIP}
          />
        </div>
      );
    }
    // Default placeholder
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white/50 border border-slate-200 rounded-2xl p-8 text-center min-h-[500px]">
        <SparklesIcon className="w-16 h-16 text-brand-orange mb-4" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Viral Content Awaits</h2>
        <p className="text-slate-500 mt-2 max-w-sm">Select a playbook, fill in the details, and let the AI architect your next viral hit.</p>
      </div>
    );
  };

  const renderAnalyzeModeContent = () => {
    if (isLoading) {
      return <Loader message="Deconstructing Virality..." subMessage="Our AI is analyzing the post's DNA." />;
    }
    if (error) {
      return <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl"><p>{error}</p></div>;
    }
    if (analysisResult) {
      return <AnalysisViewer analysis={analysisResult} />;
    }
    // Default placeholder
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white/50 border border-slate-200 rounded-2xl p-8 text-center min-h-[500px]">
        <ChartBarIcon className="w-16 h-16 text-brand-orange mb-4" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Unlock Post Insights</h2>
        <p className="text-slate-500 mt-2 max-w-sm">Paste a public post URL to get an unparalleled, AI-driven analysis.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 self-start">
             <div className="p-2">
                 <div className="relative flex items-center bg-slate-100 rounded-lg p-1">
                    <div
                        className={`absolute left-1 top-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-slate-800 rounded-md shadow-md transition-transform duration-300 ease-in-out
                        ${appMode === 'analyze' ? 'translate-x-full' : 'translate-x-0'}`}
                    />
                    <TabButton name="Create" isActive={appMode === 'create'} onClick={() => handleModeChange('create')} />
                    <TabButton name="Analyze" isActive={appMode === 'analyze'} onClick={() => handleModeChange('analyze')} />
                 </div>
             </div>
             <div className="p-6">
                {appMode === 'create' ? (
                    <Controls userInputs={userInputs} setUserInputs={setUserInputs} onGenerate={handleGenerate} isLoading={isLoading} />
                ) : (
                    <AnalysisControls onAnalyze={handleAnalyze} isLoading={isLoading} />
                )}
             </div>
          </div>

          <div className="lg:col-span-7 mt-8 lg:mt-0">
            {appMode === 'create' ? renderCreateModeContent() : renderAnalyzeModeContent()}
          </div>
        </div>
      </main>
      <footer className="text-center p-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ViralFlow. AI-Powered Growth.</p>
      </footer>
    </div>
  );
};

export default App;
