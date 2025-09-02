
// Fix: Added GenerateVideosResponse to the import from "@google/genai" to be used with the Operation type.
import { GoogleGenAI, Type, Operation, GenerateVideosResponse } from "@google/genai";
import type { UserInputs, ViralContent, ContentPart, PostAnalysis, OptimizedPart, Playbook } from '../types';
import { PLAYBOOKS } from '../types';

export const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI;

const getAi = (): GoogleGenAI => {
    if (!ai) {
        if (!API_KEY) {
            throw new Error("API_KEY environment variable is not set.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    contentParts: {
      type: Type.ARRAY,
      description: 'An array of content parts for a multi-part format like a carousel or thread. Each part has a title and body.',
      items: {
        type: Type.OBJECT,
        properties: {
          partNumber: { type: Type.INTEGER, description: 'The sequential number of the part.' },
          title: { type: Type.STRING, description: 'A short, attention-grabbing title or hook for the part.' },
          body: { type: Type.STRING, description: 'The main value-driven content of the part.' },
          highlight: { type: Type.STRING, description: 'A key phrase from the body to highlight in orange for emphasis.' },
        },
        required: ["partNumber", "title", "body"]
      },
    },
    script: {
      type: Type.STRING,
      description: 'The full text for a video script, including hook, body, and call-to-action.'
    },
    postBody: {
      type: Type.STRING,
      description: 'The full text content for a single social media post.'
    },
    captions: {
      type: Type.ARRAY,
      description: '3 suggested viral captions for the post.',
      items: { type: Type.STRING }
    },
    hashtags: {
      type: Type.ARRAY,
      description: '15 relevant and trending hashtags.',
      items: { type: Type.STRING }
    },
    nextTopicSuggestion: {
      type: Type.STRING,
      description: 'A suggestion for the next viral topic the user should post about.'
    },
  },
  required: ["captions", "hashtags", "nextTopicSuggestion"]
};


const getFormatInstructions = (format: UserInputs['format'], slideCount: number): string => {
  switch (format) {
    case 'Carousel':
    case 'Thread':
    case 'Story':
      return `
        Create the content for a ${slideCount}-part ${format}.
        Each part must have a title and body, following a story arc: Hook -> Value -> Engagement -> Call-to-Action.
        The final part should always be an engagement-focused Call-to-Action.
        Ensure the 'highlight' text is a short, impactful phrase taken directly from the 'body' of the same part.
        Provide this content in the 'contentParts' array.
      `;
    case 'Video Script':
      return `
        Write a concise and engaging video script for a short-form video (like TikTok, Reels, or YouTube Shorts).
        The script should have a strong hook, a value-packed body, and a clear call-to-action at the end.
        The script should be formatted for easy reading.
        Provide the entire script as a single string in the 'script' field.
      `;
    case 'Post':
      return `
        Write a single, impactful social media post for the specified platform.
        The post should be well-structured, provide value, and encourage engagement based on the user's goal.
        Provide the entire post content as a single string in the 'postBody' field.
      `;
    default:
        return '';
  }
}

const buildStandardPrompt = (inputs: UserInputs): string => {
  const formatInstructions = getFormatInstructions(inputs.format, inputs.slideCount);
  return `
    You are ViralFlow, the most advanced AI-powered social media strategist and viral content creator. You are bold, creative, minimalistic, and 100% focused on creating content that goes viral.

    Your task is to generate a viral social media post based on the following user requirements:
    - Platform: ${inputs.platform}
    - Topic: "${inputs.playbookInputs.topic}"
    - Tone: ${inputs.tone}
    - Format: ${inputs.format}
    - Goal: ${inputs.goal}
    ${(inputs.format === 'Carousel' || inputs.format === 'Thread' || inputs.format === 'Story') ? `- Number of Parts: ${inputs.slideCount}` : ''}

    ${formatInstructions}

    In addition to the main content, also provide 3 viral captions, 15 relevant hashtags, and a suggestion for the next viral topic.

    Please provide your response in a pure JSON format, adhering to the provided schema. Only populate the field relevant to the requested format ('contentParts', 'script', or 'postBody'). Do not include any introductory text, markdown formatting, or explanations outside of the JSON structure.
  `;
};

const buildPlaybookPrompt = (inputs: UserInputs, playbook: Playbook): string => {
  let brief = playbook.promptTemplate || '';

  // Replace all [VARIABLE] placeholders with user input
  for (const key in inputs.playbookInputs) {
      const placeholder = `[${key}]`;
      // Using a RegExp with 'g' flag to replace all occurrences
      brief = brief.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), inputs.playbookInputs[key]);
  }

  const formatInstructions = getFormatInstructions(inputs.format, inputs.slideCount);

  return `
      You are ViralFlow, the most advanced AI-powered social media strategist and viral content creator. You are bold, creative, minimalistic, and 100% focused on creating content that goes viral.

      Your task is to execute the following creative brief with extreme expertise. After executing the brief, you must transform the output into a final, ready-to-post piece of content based on the user's desired format.
      
      --- CREATIVE BRIEF ---
      ${brief}
      --- END BRIEF ---
      
      **Final Output Specifications:**
      - Platform: ${inputs.platform}
      - Format: ${inputs.format}
      - Tone: ${inputs.tone}
      - Goal: ${inputs.goal}
      
      **Format-Specific Instructions:**
      ${formatInstructions}

      **Additional Requirements:**
      In addition to the main content, you must also provide:
      1.  3 viral captions for the post.
      2.  15 relevant and trending hashtags.
      3.  A suggestion for the next viral topic the user should post about.

      Please provide your entire response in a pure JSON format, adhering to the provided schema. Only populate the field relevant to the requested format ('contentParts', 'script', or 'postBody'). Do not include any introductory text, markdown formatting, or explanations outside of the JSON structure.
  `;
}


export const generateViralContent = async (inputs: UserInputs): Promise<ViralContent | null> => {
  const selectedPlaybook = PLAYBOOKS.find(p => p.id === inputs.playbookId);
  
  let prompt: string;
  if (selectedPlaybook && selectedPlaybook.promptTemplate) {
      prompt = buildPlaybookPrompt(inputs, selectedPlaybook);
  } else {
      prompt = buildStandardPrompt(inputs);
  }

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.error("Gemini API returned an empty response.");
      return null;
    }

    const parsedJson: ViralContent = JSON.parse(jsonText);
    
    if (parsedJson && (parsedJson.contentParts || parsedJson.script || parsedJson.postBody)) {
      return parsedJson;
    } else {
      console.error("Parsed JSON does not contain any main content or does not match structure:", parsedJson);
      return null;
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from AI. Please check the console for more details.");
  }
};

// --- ANALYSIS LOGIC ---

const analysisResponseSchema = {
    type: Type.OBJECT,
    properties: {
        viralPotentialScore: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: 'A score from 0-100 representing the viral potential.' },
                justification: { type: Type.STRING, description: 'A brief explanation for the score.' },
            },
            required: ['score', 'justification'],
        },
        hookAnalysis: {
            type: Type.OBJECT,
            properties: {
                effectiveness: { type: Type.STRING, description: 'Rating of the hook: Poor, Average, Good, or Excellent.' },
                feedback: { type: Type.STRING, description: 'Specific feedback on the hook.' },
                suggestion: { type: Type.STRING, description: 'An improved version of the hook.' },
            },
            required: ['effectiveness', 'feedback', 'suggestion'],
        },
        contentBreakdown: {
            type: Type.OBJECT,
            properties: {
                storytelling: { type: Type.STRING, description: 'Analysis of the storytelling arc.' },
                valueProposition: { type: Type.STRING, description: 'Analysis of the value delivered to the audience.' },
                callToAction: { type: Type.STRING, description: 'Analysis of the effectiveness of the call to action.' },
            },
            required: ['storytelling', 'valueProposition', 'callToAction'],
        },
        audienceSentiment: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: 'A summary of the overall audience sentiment.' },
                positive: { type: Type.INTEGER, description: 'Percentage of positive sentiment.' },
                neutral: { type: Type.INTEGER, description: 'Percentage of neutral sentiment.' },
                negative: { type: Type.INTEGER, description: 'Percentage of negative sentiment.' },
                questions: { type: Type.INTEGER, description: 'Percentage of comments that are questions.' },
            },
            required: ['summary', 'positive', 'neutral', 'negative', 'questions'],
        },
        growthOpportunities: {
            type: Type.ARRAY,
            description: 'A list of 3-5 actionable growth opportunities based on the analysis.',
            items: { type: Type.STRING },
        },
        xFactor: {
            type: Type.OBJECT,
            properties: {
                identified: { type: Type.BOOLEAN, description: 'Whether a unique "X-Factor" was identified.' },
                description: { type: Type.STRING, description: 'Description of the X-Factor that makes the content stand out.' },
            },
            required: ['identified', 'description'],
        },
    },
    required: ['viralPotentialScore', 'hookAnalysis', 'contentBreakdown', 'audienceSentiment', 'growthOpportunities', 'xFactor'],
};


const buildAnalysisPrompt = (url: string): string => {
  return `
    You are ViralFlow, the world's most advanced AI social media data analyst. You have deep expertise in marketing psychology, content strategy, and virality engineering. Your analysis is sharp, insightful, and always actionable.

    Task: Analyze the social media post at the following URL and provide a comprehensive data-driven breakdown. Assume you can access and understand the content (video, images, text, comments) from the URL.
    - Post URL: ${url}

    Provide a deep analysis covering the following areas:
    1.  **Viral Potential Score:** An objective score (0-100) based on the hook, content quality, engagement potential, and shareability.
    2.  **Hook Analysis:** Deconstruct the first 3 seconds or the main headline. Is it effective? Why? How could it be better?
    3.  **Content Breakdown:** Analyze the core message, its structure, the value it provides, and the clarity of its call to action.
    4.  **Audience Sentiment:** Based on the visible comments, categorize the general sentiment (Positive, Neutral, Negative, Questions).
    5.  **Growth Opportunities:** Provide 3-5 concrete, actionable tips for the creator to improve this post or future content.
    6.  **X-Factor:** Identify the single most unique or powerful element of this post that makes it stand out (or note its absence).

    Please provide your response in a pure JSON format, adhering to the provided schema. Do not include any introductory text, markdown formatting, or explanations outside of the JSON structure.
  `;
}

export const analyzeContent = async (url: string): Promise<PostAnalysis | null> => {
  if (!url || !url.startsWith('http')) {
    throw new Error("A valid Post URL is required for analysis.");
  }
  const prompt = buildAnalysisPrompt(url);
  
  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.error("Gemini API returned an empty analysis response.");
      return null;
    }

    const parsedJson: PostAnalysis = JSON.parse(jsonText);
    
    if (parsedJson && parsedJson.viralPotentialScore && parsedJson.growthOpportunities) {
      return parsedJson;
    } else {
      console.error("Parsed JSON does not match expected PostAnalysis structure:", parsedJson);
      return null;
    }

  } catch (error) {
    console.error("Error calling Gemini API for analysis:", error);
    throw new Error("Failed to analyze content from AI. The URL might be inaccessible or the format unsupported.");
  }
};


// --- NEW OPTIMIZATION LOGIC ---

const optimizationResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      partNumber: { type: Type.INTEGER, description: 'Should always be 1.' },
      title: { type: Type.STRING, description: 'The new hook title.' },
      body: { type: Type.STRING, description: 'The new hook body text.' },
      viralScore: { type: Type.INTEGER, description: 'A score from 0-100 for viral potential.' },
      rationale: { type: Type.STRING, description: 'A brief explanation for the score and the psychological trigger used.' },
    },
    required: ["partNumber", "title", "body", "viralScore", "rationale"]
  }
};

const buildOptimizationPrompt = (originalHook: ContentPart, inputs: UserInputs): string => {
  return `
    You are ViralFlow's A/B Testing Specialist. Your sole purpose is to analyze a piece of content and generate superior, higher-performing alternatives based on proven marketing psychology. You are data-driven, creative, and concise.

    Your task is to take an original social media hook (the first slide of a carousel) and create 3 powerful alternatives. Then, you must score all four versions (the original + your 3 new ones) on their viral potential.

    **User's Goal for this Content:**
    - Platform: ${inputs.platform}
    - Topic: "${inputs.playbookInputs.topic || inputs.playbookInputs['YOUR NICHE']}"
    - Tone: ${inputs.tone}
    - Goal: ${inputs.goal}

    **Original Hook:**
    - Title: "${originalHook.title}"
    - Body: "${originalHook.body}"

    **Instructions:**
    1.  Generate 3 new, distinct versions of the hook. Each version should use a different psychological angle to grab attention. Examples of angles:
        - **Curiosity Gap:** Make the audience desperate to know the answer.
        - **Contrarian Take:** Challenge a popular belief.
        - **Pain Point Agitation:** Directly address a deep frustration of the target audience.
        - **Bold Promise:** Offer a highly desirable outcome.
        - **Social Proof:** Hint at a widely adopted secret or method.
    2.  For each of the 4 hooks (the original + 3 new), provide:
        - A \`viralScore\` (an integer between 0 and 100) representing its likelihood to stop the scroll and compel engagement.
        - A brief \`rationale\` (max 20 words) explaining *why* it works and what psychological trigger it uses.
    3.  Ensure the new \`title\` and \`body\` for each version are concise and impactful, suitable for a carousel cover. Maintain the original's core topic but reframe the angle.
    4. The partNumber for all generated parts must be 1.
    5. The very first item in the returned array must be the original hook, along with its new score and rationale.

    Provide your response as a pure JSON array, adhering to the provided schema. Do not include any introductory text, markdown, or explanations.
  `;
}

export const generateOptimizedHooks = async (originalHook: ContentPart, inputs: UserInputs): Promise<OptimizedPart[] | null> => {
  const prompt = buildOptimizationPrompt(originalHook, inputs);
  
  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: optimizationResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.error("Gemini API returned an empty optimization response.");
      return null;
    }

    const parsedJson: OptimizedPart[] = JSON.parse(jsonText);
    
    if (Array.isArray(parsedJson) && parsedJson.length > 0) {
      return parsedJson;
    } else {
      console.error("Parsed JSON does not match expected OptimizedPart[] structure:", parsedJson);
      return null;
    }

  } catch (error) {
    console.error("Error calling Gemini API for optimization:", error);
    throw new Error("Failed to optimize content from AI.");
  }
};

// --- VIDEO GENERATION LOGIC ---
// Fix: Specified the generic type for Operation as GenerateVideosResponse to fix the TypeScript error.
export const generateVideo = async (prompt: string): Promise<Operation<GenerateVideosResponse>> => {
    try {
        const operation = await getAi().models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
            },
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        throw new Error("Failed to start video generation.");
    }
};

// Fix: Specified the generic type for Operation as GenerateVideosResponse for both the parameter and return type to fix TypeScript errors.
export const getVideosOperation = async (operation: Operation<GenerateVideosResponse>): Promise<Operation<GenerateVideosResponse>> => {
    try {
        const updatedOperation = await getAi().operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error polling video generation status:", error);
        throw new Error("Failed to get video generation status.");
    }
};
