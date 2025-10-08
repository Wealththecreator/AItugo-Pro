#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const SOURCES = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    priority: 0.9,
  },
  {
    name: 'The Information - AI',
    url: 'https://www.theinformation.com/topics/artificial-intelligence/feed',
    priority: 0.85,
  },
  {
    name: 'MIT Technology Review - AI',
    url: 'https://www.technologyreview.com/feed/topic/artificial-intelligence/',
    priority: 0.8,
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    priority: 0.75,
  },
  {
    name: 'Creator Economy by Every',
    url: 'https://every.to/tag/creator-economy/rss',
    priority: 0.6,
  },
  {
    name: 'Andreessen Horowitz - AI',
    url: 'https://a16z.com/tag/artificial-intelligence/feed/',
    priority: 0.65,
  },
  {
    name: 'OpenAI News',
    url: 'https://openai.com/index.xml',
    priority: 0.7,
  },
];

const OPPORTUNITY_BUCKETS = [
  {
    type: 'Tools & Products',
    keywords: ['launch', 'tool', 'product', 'platform', 'feature', 'update', 'workflow', 'integration'],
    actions: {
      creators: [
        'Experiment with the featured tool in a pilot project.',
        'Share a behind-the-scenes breakdown or tutorial for your audience.',
      ],
      entrepreneurs: [
        'Evaluate partnership or integration opportunities with the tool.',
        'Assess potential to streamline internal operations using this solution.',
      ],
    },
  },
  {
    type: 'Funding & Investment',
    keywords: ['funding', 'raises', 'raised', 'investment', 'venture', 'seed', 'capital', 'acquired', 'acquisition'],
    actions: {
      creators: [
        'Create a perspective piece on the funding news and its market impact.',
        'Pitch collaboration or sponsorship ideas while momentum is high.',
      ],
      entrepreneurs: [
        'Benchmark the round to understand investor appetite in your niche.',
        'Reach out to mentioned investors or founders for potential partnerships.',
      ],
    },
  },
  {
    type: 'Partnerships & Expansion',
    keywords: ['partnership', 'partnered', 'collaboration', 'expansion', 'global', 'availability', 'distribution'],
    actions: {
      creators: [
        'Explain how the partnership shifts the tool stack for makers.',
        'Highlight new geographic or platform access for your community.',
      ],
      entrepreneurs: [
        'Map how the expansion affects competitive positioning in your market.',
        'Identify channels unlocked by the partnership and plan experiments.',
      ],
    },
  },
  {
    type: 'Regulation & Policy',
    keywords: ['regulation', 'policy', 'compliance', 'law', 'government', 'guidelines', 'standards'],
    actions: {
      creators: [
        'Produce an explainer on how the regulation impacts creative workflows.',
        'Share compliance checklists or templates for your audience.',
      ],
      entrepreneurs: [
        'Evaluate operational changes needed to stay compliant.',
        'Consult with legal advisors and update customer messaging accordingly.',
      ],
    },
  },
  {
    type: 'Research & Breakthroughs',
    keywords: ['research', 'study', 'paper', 'breakthrough', 'model', 'architecture', 'benchmark'],
    actions: {
      creators: [
        'Translate complex findings into digestible content for your audience.',
        'Experiment with demos to showcase the breakthrough in action.',
      ],
      entrepreneurs: [
        'Assess if the breakthrough unlocks new product capabilities.',
        'Update product roadmap or pitch materials with relevant data points.',
      ],
    },
  },
  {
    type: 'Education & Playbooks',
    keywords: ['guide', 'playbook', 'course', 'tutorial', 'framework', 'strategy', 'tips', 'handbook'],
    actions: {
      creators: [
        'Transform the playbook into a live session or workshop.',
        'Curate a content series applying the shared strategy step-by-step.',
      ],
      entrepreneurs: [
        'Roll the framework into team training or SOP updates.',
        'Adapt the strategy into a customer-facing resource or lead magnet.',
      ],
    },
  },
];

const FOCUS_KEYWORDS = {
  creators: ['creator', 'creators', 'audience', 'community', 'content', 'influencer', 'youtuber', 'tiktok', 'newsletter'],
  entrepreneurs: ['startup', 'founder', 'entrepreneur', 'business', 'company', 'market', 'revenue', 'roi', 'product'],
};

const ADDITIONAL_KEYWORDS = ['ai', 'artificial intelligence', 'genai', 'machine learning', 'automation', 'workflow'];

const USER_AGENT = 'AITugo-Pro-NewsScraper/1.0 (+https://github.com/)';

function decodeHtmlEntities(text = '') {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? decodeHtmlEntities(match[1].trim()) : '';
}

function parseRss(xml) {
  const items = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml))) {
    const itemXml = match[0];
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'updated') || extractTag(itemXml, 'dc:date');
    const description = extractTag(itemXml, 'description');
    const content = extractTag(itemXml, 'content:encoded') || description;
    items.push({
      title,
      link,
      isoDate: pubDate ? new Date(pubDate).toISOString() : '',
      content,
      contentSnippet: description,
      summary: extractTag(itemXml, 'summary'),
    });
  }
  return items;
}

const cliArgs = process.argv.slice(2);
let limit = 25;
let outputFile = '';
let outputFormat = 'json';

for (const arg of cliArgs) {
  if (arg.startsWith('--limit=')) {
    const parsed = Number.parseInt(arg.split('=')[1] ?? '', 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = parsed;
    }
  } else if (arg.startsWith('--out=')) {
    outputFile = arg.split('=')[1] ?? '';
  } else if (arg.startsWith('--format=')) {
    outputFormat = arg.split('=')[1] ?? 'json';
  }
}

function cleanText(input = '') {
  if (!input) return '';
  return decodeHtmlEntities(input)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSummary(article) {
  const { contentSnippet, content, summary } = article;
  const raw = cleanText(summary || contentSnippet || content || '');
  if (!raw) return '';
  const sentences = raw.split(/(?<=[.!?])\s+/).slice(0, 3);
  return sentences.join(' ');
}

function keywordFrequency(text, keywords) {
  const lowered = text.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    const matches = lowered.match(new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'));
    if (matches) {
      score += matches.length;
    }
  }
  return score;
}

function detectOpportunity(text) {
  const lowered = text.toLowerCase();
  let detected = OPPORTUNITY_BUCKETS[0];
  let score = 0;
  for (const bucket of OPPORTUNITY_BUCKETS) {
    const bucketScore = keywordFrequency(lowered, bucket.keywords);
    if (bucketScore > score) {
      detected = bucket;
      score = bucketScore;
    }
  }
  return { bucket: detected, score };
}

function evaluateFocus(text) {
  const lowered = text.toLowerCase();
  const creatorsScore = keywordFrequency(lowered, FOCUS_KEYWORDS.creators);
  const entrepreneursScore = keywordFrequency(lowered, FOCUS_KEYWORDS.entrepreneurs);
  return { creatorsScore, entrepreneursScore };
}

function enrichArticle(article, sourceMeta) {
  const fullText = cleanText(article.content || article.contentSnippet || '');
  const summary = extractSummary(article);
  const { creatorsScore, entrepreneursScore } = evaluateFocus(`${article.title}. ${summary} ${fullText}`);
  const additionalScore = keywordFrequency(fullText.toLowerCase(), ADDITIONAL_KEYWORDS);
  const { bucket, score: bucketScore } = detectOpportunity(`${article.title} ${summary}`);

  const publishedAt = article.isoDate ? new Date(article.isoDate) : new Date();
  const ageHours = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  const urgency = ageHours <= 24 ? 'Act today' : ageHours <= 72 ? 'Plan this week' : 'Monitor';

  const opportunityScore = Number(
    (
      (1 / Math.log10(ageHours + 10)) +
      bucketScore * 0.8 +
      additionalScore * 0.5 +
      Math.max(creatorsScore, entrepreneursScore) * 0.7 +
      sourceMeta.priority
    ).toFixed(2),
  );

  const focus = creatorsScore === entrepreneursScore
    ? 'Creators & Entrepreneurs'
    : creatorsScore > entrepreneursScore
      ? 'Creators'
      : 'Entrepreneurs';

  const actions = bucket.actions[creatorsScore >= entrepreneursScore ? 'creators' : 'entrepreneurs'];

  const keywordHits = ADDITIONAL_KEYWORDS.filter((keyword) => fullText.toLowerCase().includes(keyword));

  return {
    source: sourceMeta.name,
    title: article.title?.trim() ?? 'Untitled',
    url: article.link,
    publishedAt: publishedAt.toISOString(),
    summary,
    focus,
    focusBreakdown: {
      creatorsScore,
      entrepreneursScore,
    },
    opportunityType: bucket.type,
    urgency,
    opportunityScore,
    recommendedActions: actions,
    metrics: {
      recencyHours: Number(ageHours.toFixed(1)),
      keywordHits,
      estimatedWordCount: fullText.split(/\s+/).filter(Boolean).length,
    },
    excerpt: fullText.slice(0, 400),
  };
}

function buildProxyUrl(url) {
  const normalized = url.replace(/^https?:\/\//i, '');
  return `https://r.jina.ai/http://${normalized}`;
}

async function download(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

async function fetchFeed(source) {
  try {
    let xml = await download(source.url);
    if (!xml.trim()) {
      xml = await download(buildProxyUrl(source.url));
    }

    const items = parseRss(xml);
    return items.map((item) => ({ item, source }));
  } catch (error) {
    try {
      const fallbackXml = await download(buildProxyUrl(source.url));
      const items = parseRss(fallbackXml);
      if (items.length) {
        console.warn(`Used proxy to load feed for ${source.name}.`);
        return items.map((item) => ({ item, source }));
      }
    } catch (fallbackError) {
      console.error(`Failed to load feed for ${source.name}:`, fallbackError?.message || fallbackError);
      return [];
    }

    console.error(`Failed to load feed for ${source.name}:`, error?.message || error);
    return [];
  }
}

async function scrape() {
  const results = await Promise.all(SOURCES.map(fetchFeed));
  const flattened = results.flat();
  const seen = new Set();
  const enriched = [];

  for (const { item, source } of flattened) {
    if (!item.link || seen.has(item.link)) continue;
    seen.add(item.link);
    const enrichedArticle = enrichArticle(item, source);
    if (enrichedArticle.summary && enrichedArticle.summary.toLowerCase().includes('ai')) {
      enriched.push(enrichedArticle);
      continue;
    }
    const text = `${enrichedArticle.title} ${enrichedArticle.summary}`.toLowerCase();
    if (ADDITIONAL_KEYWORDS.some((keyword) => text.includes(keyword))) {
      enriched.push(enrichedArticle);
    }
  }

  const sorted = enriched.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const trimmed = sorted.slice(0, limit);

  if (!trimmed.length) {
    const fallbackPath = new URL('./sample-ai-news.json', import.meta.url);
    const sample = JSON.parse(await readFile(fallbackPath, 'utf8'));
    return sample.slice(0, limit);
  }

  return trimmed;
}

function buildOverview(articles) {
  const totals = {
    totalArticles: articles.length,
    focus: {
      creators: 0,
      entrepreneurs: 0,
      both: 0,
    },
    topOpportunities: new Map(),
    averageScore: 0,
    urgentCount: 0,
  };

  for (const article of articles) {
    if (article.focus === 'Creators') totals.focus.creators += 1;
    else if (article.focus === 'Entrepreneurs') totals.focus.entrepreneurs += 1;
    else totals.focus.both += 1;

    totals.averageScore += article.opportunityScore;
    totals.urgentCount += article.urgency === 'Act today' ? 1 : 0;

    totals.topOpportunities.set(
      article.opportunityType,
      (totals.topOpportunities.get(article.opportunityType) ?? 0) + 1,
    );
  }

  const sortedOpportunities = [...totals.topOpportunities.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type, count }));

  return {
    totalArticles: totals.totalArticles,
    urgentOpportunities: totals.urgentCount,
    averageOpportunityScore: totals.totalArticles
      ? Number((totals.averageScore / totals.totalArticles).toFixed(2))
      : 0,
    focusBreakdown: totals.focus,
    topOpportunityThemes: sortedOpportunities,
  };
}

function toTableRows(articles) {
  return articles.map((article) => ({
    Published: new Date(article.publishedAt).toISOString().split('T')[0],
    Source: article.source,
    Focus: article.focus,
    Opportunity: article.opportunityType,
    Urgency: article.urgency,
    Score: article.opportunityScore,
    Title: article.title,
  }));
}

async function main() {
  const articles = await scrape();
  const overview = buildOverview(articles);

  if (outputFormat === 'table') {
    console.table(toTableRows(articles));
    console.log('\nOverview:', overview);
  } else {
    const payload = {
      generatedAt: new Date().toISOString(),
      sources: SOURCES.map((source) => source.name),
      overview,
      articles,
    };

    if (outputFile) {
      await writeFile(outputFile, JSON.stringify(payload, null, 2), 'utf8');
      console.log(`Saved actionable briefing to ${outputFile}`);
    } else {
      console.log(JSON.stringify(payload, null, 2));
    }
  }
}

main().catch((error) => {
  console.error('Unexpected error while scraping news:', error);
  process.exitCode = 1;
});

