export type IntelligenceCategory =
  | 'Learn AI'
  | 'News & Trends'
  | 'AI Tools in Action'
  | 'AI for Money'
  | 'Get Inspired';

export type PlatformType =
  | 'Newsletter'
  | 'Analytics Platform'
  | 'Community'
  | 'Social Feed'
  | 'Podcast'
  | 'Database'
  | 'Directory'
  | 'YouTube'
  | 'Market Report';

export interface IntelligenceSource {
  id: string;
  name: string;
  url: string;
  categories: IntelligenceCategory[];
  platformType: PlatformType;
  description: string;
  audienceFocus: string;
  keySignals: {
    reach: string;
    cadence: string;
    formats: string[];
  };
  dataHighlights: {
    trendingTopics: string[];
    monetizationAngles: string[];
    creatorTakeaways: string[];
  };
  proofPoints: string[];
  signalStrength: 'Emerging' | 'Momentum' | 'Dominant';
  credibilityScore: number; // 1-100
  impactScore: number; // 1-100 relative value for entrepreneurs/creators
  callToAction: string;
}

export const intelligenceSources: IntelligenceSource[] = [
  {
    id: 'therundown-ai',
    name: 'The Rundown AI',
    url: 'https://therundown.ai',
    categories: ['Learn AI', 'News & Trends', 'AI Tools in Action'],
    platformType: 'Newsletter',
    description:
      'Daily breakdowns of AI product launches, funding moves, and workflow-ready prompts curated for builders.',
    audienceFocus: 'Busy founders and solo creators who need fast signal on what to experiment with next.',
    keySignals: {
      reach: '500K+ subscribers',
      cadence: 'Daily',
      formats: ['Email brief', 'Prompt packs', 'Workflow templates'],
    },
    dataHighlights: {
      trendingTopics: ['AI agents', 'Workflow automation', 'Founders using AI'],
      monetizationAngles: [
        'Turn their daily “Prompt Playbook” into mini digital products to sell',
        'Use featured launches as affiliate review opportunities',
      ],
      creatorTakeaways: [
        'Extract their daily “Build Mode” section as fast content for LinkedIn threads',
        'Borrow the problem-solution framing for your own updates',
      ],
    },
    proofPoints: [
      'Tracks engagement rate versus open rate to highlight high-performing story angles',
      'Features a breakdown of how creators are monetising new tools each week',
    ],
    signalStrength: 'Dominant',
    credibilityScore: 88,
    impactScore: 91,
    callToAction: 'Turn the daily build stories into carousel formats within 30 minutes of receiving the email.',
  },
  {
    id: 'stability-ai-research',
    name: 'Stability AI Research Updates',
    url: 'https://stability.ai/blog',
    categories: ['Learn AI', 'News & Trends'],
    platformType: 'Analytics Platform',
    description:
      'Model release notes and product deep dives that show where generative imagery, audio, and video are heading next.',
    audienceFocus: 'Vision-focused creators, brand designers, and agencies testing multimodal campaigns.',
    keySignals: {
      reach: '3M+ monthly readers',
      cadence: 'Bi-weekly',
      formats: ['Research blog', 'Sample assets', 'Open-source repos'],
    },
    dataHighlights: {
      trendingTopics: ['Text-to-video', 'Fine-tuning', 'Creator licensing models'],
      monetizationAngles: [
        'Package “before vs after” case studies for clients using Stability templates',
        'Offer premium mood boards based on their style studies',
      ],
      creatorTakeaways: [
        'Use their sample prompts to demonstrate capabilities on Instagram Stories',
        'Track licensing conversations to position yourself as an ethical AI partner',
      ],
    },
    proofPoints: [
      'Includes benchmark comparisons you can turn into quick LinkedIn charts',
      'Highlights partner programs with performance-based payouts for creators',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 84,
    impactScore: 86,
    callToAction: 'Translate each model drop into a one-page pitch for clients exploring AI visuals.',
  },
  {
    id: 'reddit-aitools',
    name: 'Reddit r/AITools & r/Artificial',
    url: 'https://www.reddit.com/r/AITools/',
    categories: ['AI Tools in Action', 'News & Trends', 'Get Inspired'],
    platformType: 'Community',
    description:
      'Crowdsourced experiments, failure case studies, and raw sentiment straight from power users shipping with AI.',
    audienceFocus: 'Operators who want real feedback on what works before they invest time into a build.',
    keySignals: {
      reach: '1.2M+ combined members',
      cadence: 'Real-time',
      formats: ['Case studies', 'Prompt swaps', 'AMA threads'],
    },
    dataHighlights: {
      trendingTopics: ['Prompt marketplaces', 'Niche GPTs', 'Pricing backlash'],
      monetizationAngles: [
        'Spot patterns in paid prompt demand to launch micro-products',
        'Identify recurring “wishlist” features to build niche SaaS utilities',
      ],
      creatorTakeaways: [
        'Collect top comment pain-points for your next video script',
        'Reverse-engineer viral community posts into swipe-worthy carousels',
      ],
    },
    proofPoints: [
      'Weekly megathreads summarise the best prompts and tutorials—perfect for curated newsletters',
      'High-signal launch posts surface real retention metrics, not just hype',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 79,
    impactScore: 89,
    callToAction: 'Mine the weekly megathreads and turn the “Top 5 workflows” into a weekend tutorial series.',
  },
  {
    id: 'aitugo-tools-directory',
    name: 'AITugo Tools Directory',
    url: 'https://www.aitugo.com/tools',
    categories: ['AI Tools in Action', 'News & Trends'],
    platformType: 'Directory',
    description:
      'Official AITugo-curated index of AI tools with launch velocity data, monetisation hooks, and community sentiment overlays.',
    audienceFocus:
      'Creators, reviewers, and educators building curriculum or offers around high-performing AI stacks.',
    keySignals: {
      reach: '1,200+ tools mapped across creator use cases',
      cadence: 'Updated daily',
      formats: ['Directory', 'Comparison tables', 'Launch alerts'],
    },
    dataHighlights: {
      trendingTopics: ['Agent platforms', 'AI video editors', 'Automation copilots'],
      monetizationAngles: [
        'Bundle our comparison data into “starter stacks” with affiliate links',
        'Build cohort-based workshops around the highest-demand categories',
      ],
      creatorTakeaways: [
        'Track velocity scores to pick tools worth reviewing first',
        'Extract pricing tiers to help your audience budget properly',
      ],
    },
    proofPoints: [
      'AITugo signals layer trending growth and review count so you can prioritise momentum tools',
      'Exports datasets you can remix into interactive Notion hubs',
    ],
    signalStrength: 'Dominant',
    credibilityScore: 82,
    impactScore: 87,
    callToAction:
      'Publish a “tool stack for X niche” carousel using the highest-velocity categories surfaced each week.',
  },
  {
    id: 'latentspace',
    name: 'Latent Space Podcast & Substack',
    url: 'https://www.latent.space',
    categories: ['Learn AI', 'News & Trends', 'Get Inspired'],
    platformType: 'Podcast',
    description:
      'Deep interviews with founders building frontier AI companies and essays that map the technical landscape.',
    audienceFocus: 'Strategists, investors, and creators positioning themselves as thought leaders.',
    keySignals: {
      reach: '100K+ subscribers & listeners',
      cadence: 'Weekly',
      formats: ['Podcast', 'Long-form essays', 'Technical breakdowns'],
    },
    dataHighlights: {
      trendingTopics: ['AI infrastructure', 'Agent safety', 'Productization playbooks'],
      monetizationAngles: [
        'Use their “What we learned” sections to craft high-end advisory offers',
        'Repurpose guest lessons into masterclass-style content upgrades',
      ],
      creatorTakeaways: [
        'Clip the most contrarian insights into vertical video teasers',
        'Summarise each episode as a carousel with “Signal vs Noise” framing',
      ],
    },
    proofPoints: [
      'Guests share metrics like ARR or user growth that you can cite in your own narratives',
      'Episode transcripts are searchable—perfect for building quotable swipe files',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 86,
    impactScore: 83,
    callToAction: 'Build a “5-minute founder download” series summarising each new episode for LinkedIn.',
  },
  {
    id: 'linkedin-ai-creators',
    name: 'LinkedIn Top AI Creators Feed',
    url: 'https://www.linkedin.com/feed/',
    categories: ['AI Tools in Action', 'AI for Money', 'Get Inspired'],
    platformType: 'Social Feed',
    description:
      'Curated list of top-performing AI creator posts on LinkedIn with engagement benchmarks.',
    audienceFocus: 'B2B founders, agency owners, and consultants selling AI-powered services.',
    keySignals: {
      reach: 'Top 100 creators 750K+ combined followers',
      cadence: 'Daily',
      formats: ['Long-form posts', 'Carousels', 'Document posts'],
    },
    dataHighlights: {
      trendingTopics: ['Enterprise automation', 'AI sales workflows', 'ROI case studies'],
      monetizationAngles: [
        'Model your offers on the highest performing CTA frameworks',
        'Track comment questions to spin up paid workshops or templates',
      ],
      creatorTakeaways: [
        'Break down top carousels slide-by-slide to map high-converting story arcs',
        'Analyse CTA structures and reuse them in your own sequences',
      ],
    },
    proofPoints: [
      'Includes save counts and repost velocity that reveal what resonates with operators',
      'Highlights posts that triggered inbound leads for the original creator',
    ],
    signalStrength: 'Dominant',
    credibilityScore: 81,
    impactScore: 90,
    callToAction: 'Each Friday, publish a “What performed on LinkedIn this week” breakdown citing 3 data-backed plays.',
  },
  {
    id: 'a16z-ai-deals',
    name: 'a16z Generative AI Deal Tracker',
    url: 'https://a16z.com',
    categories: ['News & Trends', 'AI for Money'],
    platformType: 'Market Report',
    description:
      'Investment memos and quarterly funding maps that surface where capital is flowing inside the AI ecosystem.',
    audienceFocus: 'Entrepreneurs raising capital and creators launching premium communities.',
    keySignals: {
      reach: 'Tracked 250+ AI investments',
      cadence: 'Quarterly with rolling updates',
      formats: ['Reports', 'Interactive charts', 'Partner essays'],
    },
    dataHighlights: {
      trendingTopics: ['Vertical AI', 'AI infrastructure', 'Specialised copilots'],
      monetizationAngles: [
        'Tailor your pitches to the hot verticals investors are signalling',
        'Create investment briefings for community members as a paid product',
      ],
      creatorTakeaways: [
        'Use their charts to design authority-building LinkedIn infographics',
        'Summarise the top 3 theses into a weekly “Capital Signal” email',
      ],
    },
    proofPoints: [
      'Breaks down round sizes and participating firms for referencing credibility',
      'Filters by product category so you can spot under-served niches',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 89,
    impactScore: 88,
    callToAction: 'Share a “capital heatmap” visual each month to attract founders into your network.',
  },
  {
    id: 'oneusefulthing',
    name: 'One Useful Thing by Ethan Mollick',
    url: 'https://www.oneusefulthing.org',
    categories: ['Learn AI', 'AI Tools in Action', 'Get Inspired'],
    platformType: 'Newsletter',
    description:
      'Actionable experiments from a Wharton professor testing AI in classrooms, startups, and creative workflows.',
    audienceFocus: 'Educators, course creators, and founders building learning experiences.',
    keySignals: {
      reach: '190K+ subscribers',
      cadence: 'Weekly',
      formats: ['Essays', 'Experiments', 'Framework breakdowns'],
    },
    dataHighlights: {
      trendingTopics: ['Human + AI collaboration', 'Productivity sprints', 'Education use cases'],
      monetizationAngles: [
        'Turn his frameworks into workshop agendas with attribution',
        'Package experiment templates into downloads for newsletter upsells',
      ],
      creatorTakeaways: [
        'Document your own experiments using his “setup ➝ outcome ➝ lesson” format',
        'Compare his findings with your community’s data to build credibility',
      ],
    },
    proofPoints: [
      'Backed by academic trials you can cite to build trust',
      'Frequent mentions across mainstream press for added authority',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 90,
    impactScore: 84,
    callToAction: 'Host a live teardown of his latest experiment and share your derivative prompt pack.',
  },
  {
    id: 'creatorhook',
    name: 'Creator Hook AI Swipefile',
    url: 'https://creatorhook.com',
    categories: ['AI Tools in Action', 'Get Inspired'],
    platformType: 'Database',
    description:
      'A searchable vault of high-performing hooks, titles, and thumbnails collected from AI creator case studies.',
    audienceFocus: 'YouTube creators, short-form storytellers, and scriptwriters seeking data-backed hooks.',
    keySignals: {
      reach: '5K+ examples with performance notes',
      cadence: 'Updated weekly',
      formats: ['Swipefile', 'Breakdowns', 'Video tear-downs'],
    },
    dataHighlights: {
      trendingTopics: ['60-second explainers', 'Founder confessionals', 'AI challenge series'],
      monetizationAngles: [
        'Offer hook audits as a paid service using their scoring model',
        'Bundle winning hooks per niche into Gumroad packs',
      ],
      creatorTakeaways: [
        'Reverse-engineer video structures with their retention timestamps',
        'Use the title formulas to test A/B headlines before publishing',
      ],
    },
    proofPoints: [
      'Each entry includes performance deltas (views vs channel average)',
      'Community submissions highlight what is trending in real time',
    ],
    signalStrength: 'Emerging',
    credibilityScore: 76,
    impactScore: 82,
    callToAction: 'Turn their “hook + angle” combos into weekly shorts showcasing your storytelling chops.',
  },
  {
    id: 'producthunt-ai',
    name: 'Product Hunt AI Leaderboard',
    url: 'https://www.producthunt.com/topics/artificial-intelligence',
    categories: ['AI Tools in Action', 'News & Trends', 'AI for Money'],
    platformType: 'Community',
    description:
      'Daily launch charts for AI startups with engagement stats and maker feedback.',
    audienceFocus: 'Makers tracking launch playbooks and growth marketers seeking partnership-ready apps.',
    keySignals: {
      reach: '4M+ monthly visits',
      cadence: 'Daily',
      formats: ['Leaderboard', 'Commentary', 'Maker interviews'],
    },
    dataHighlights: {
      trendingTopics: ['AI CRM', 'Creator monetization tools', 'AI note-taking'],
      monetizationAngles: [
        'Review top launches and add affiliate or sponsor deals',
        'Offer launch consulting packaged as “Product Hunt sprints”',
      ],
      creatorTakeaways: [
        'Capture maker quotes to build authority-laced carousel slides',
        'Study top comment questions to craft follow-up demos',
      ],
    },
    proofPoints: [
      'Shows vote velocity, comment count, and ranking to benchmark your own launches',
      'Makers disclose tech stacks you can cite in tutorials',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 80,
    impactScore: 85,
    callToAction: 'Create a Monday “Leaderboard to Launchpad” video summarising the weekend’s winners.',
  },
  {
    id: 'midjourney',
    name: 'Midjourney Community Showcase',
    url: 'https://www.midjourney.com/showcase',
    categories: ['Get Inspired', 'AI Tools in Action'],
    platformType: 'Community',
    description:
      'Live gallery of AI-generated visuals ranked by community upvotes and prompt transparency.',
    audienceFocus: 'Visual storytellers, brand designers, and e-commerce founders building assets in-house.',
    keySignals: {
      reach: '16M+ images indexed',
      cadence: 'Real-time',
      formats: ['Gallery', 'Prompt recipes', 'Community upvotes'],
    },
    dataHighlights: {
      trendingTopics: ['AI fashion editorials', 'Product mockups', 'Story-driven imagery'],
      monetizationAngles: [
        'Reskin winning prompts into brand-specific offerings',
        'Turn top-rated visuals into paid mood board bundles',
      ],
      creatorTakeaways: [
        'Note lighting + camera angles for your own production briefs',
        'Highlight prompt structures in educational reels',
      ],
    },
    proofPoints: [
      'Each image includes the full prompt and model settings',
      'Community leaderboard surfaces trending aesthetics per week',
    ],
    signalStrength: 'Dominant',
    credibilityScore: 83,
    impactScore: 86,
    callToAction: 'Host a “prompt remix” live session turning top gallery pieces into new brand stories.',
  },
  {
    id: 'stacked-marketer',
    name: 'Stacked Marketer AI Brief',
    url: 'https://www.stackedmarketer.com',
    categories: ['News & Trends', 'AI for Money'],
    platformType: 'Newsletter',
    description:
      'Performance marketing intelligence with a dedicated AI monetisation section covering funnels and paid campaigns.',
    audienceFocus: 'Growth marketers, funnel consultants, and agency owners packaging AI services.',
    keySignals: {
      reach: '45K+ daily readers',
      cadence: 'Weekdays',
      formats: ['Newsletter', 'Mini case studies', 'Deal alerts'],
    },
    dataHighlights: {
      trendingTopics: ['Ad creative automation', 'Email personalisation', 'AI lead gen'],
      monetizationAngles: [
        'Convert their “plays of the day” into service deliverables',
        'Use featured deals to negotiate partner discounts for communities',
      ],
      creatorTakeaways: [
        'Share screenshot breakdowns of winning funnels as carousels',
        'Bundle the best ad angles into a lead magnet',
      ],
    },
    proofPoints: [
      'Includes CPM/CPC benchmarks to inform pricing',
      'Highlights paid acquisition experiments with actual ROI numbers',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 78,
    impactScore: 80,
    callToAction: 'Send a Friday “AI Ad Angle” digest that riffs on their benchmark data.',
  },
  {
    id: 'indiehackers-ai',
    name: 'Indie Hackers AI Stories',
    url: 'https://www.indiehackers.com',
    categories: ['AI for Money', 'Get Inspired'],
    platformType: 'Community',
    description:
      'Bootstrapped founders openly sharing revenue dashboards, tech stacks, and experiment logs for AI-powered products.',
    audienceFocus: 'Indie founders, makers, and community-led entrepreneurs validating AI business ideas.',
    keySignals: {
      reach: '200K+ community members',
      cadence: 'Daily',
      formats: ['AMA threads', 'Revenue breakdowns', 'Build in public logs'],
    },
    dataHighlights: {
      trendingTopics: ['Micro-SaaS', 'Paid communities', 'AI content agencies'],
      monetizationAngles: [
        'Curate their revenue milestones into “build with me” cohort sessions',
        'Offer a premium database of profitable AI experiments',
      ],
      creatorTakeaways: [
        'Document the first 10 customers framework used by successful indie hackers',
        'Study churn reasons shared publicly to strengthen your own onboarding',
      ],
    },
    proofPoints: [
      'Founders often share Stripe screenshots and exact pricing tiers',
      'Threads highlight tools + automations powering their growth',
    ],
    signalStrength: 'Momentum',
    credibilityScore: 77,
    impactScore: 88,
    callToAction: 'Launch a “Public Build Radar” newsletter featuring the top 3 transparent revenue stories each week.',
  },
];

export const intelligenceCategories: (IntelligenceCategory | 'All')[] = [
  'All',
  'Learn AI',
  'News & Trends',
  'AI Tools in Action',
  'AI for Money',
  'Get Inspired',
];

export const platformFilters: PlatformType[] = [
  'Newsletter',
  'Analytics Platform',
  'Community',
  'Social Feed',
  'Podcast',
  'Database',
  'Directory',
  'YouTube',
  'Market Report',
];
