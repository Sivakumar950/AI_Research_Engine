import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { GoogleGenAI } from '@google/genai'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Check for required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not found in environment variables')
  process.exit(1)
}
if (!process.env.IK_TOKEN) {
  console.error('IK_TOKEN not found in environment variables')
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// 1) Enhanced Gemini analysis for Commercial Courts with all required features
async function geminiAnalyzeCommercialCase(query, caseType = 'general', jurisdiction = 'general', language = 'english') {
  const prompt = `
As an expert in Indian Commercial Law and the Commercial Courts Act 2015, analyze this commercial dispute/legal query: "${query}"

Context: This analysis is for Commercial Courts in India focusing on faster dispute resolution and ease of doing business.

Case Classification: ${caseType}
Jurisdiction: ${jurisdiction}
Preferred Language: ${language}

Please provide comprehensive analysis with the following sections:

1. COMMERCIAL CASE SUMMARY: Brief summary focusing on commercial law aspects under Indian Commercial Courts Act 2015
2. LEGAL ISSUES: Identify main commercial legal issues under Indian commercial legislation
3. SEARCH TERMS: Generate 5-7 specific search terms for Indian commercial case laws and statutes
4. RELEVANT LAWS: Suggest relevant Indian commercial laws, acts, and sections
5. PREDICTIVE ANALYSIS: Based on similar commercial cases, predict likely case outcomes and timeline
6. PRECEDENTS: Identify key commercial law precedents that apply
7. PROCEDURAL GUIDANCE: Relevant commercial court procedures and timelines
8. JURISDICTION SPECIFIC: Any state/high court specific commercial laws or procedures for ${jurisdiction}
9. MULTILINGUAL TERMS: Provide key legal terms in Hindi and regional languages if applicable

Focus EXCLUSIVELY on:
- Commercial Courts Act 2015
- Indian commercial dispute resolution
- Business-related legal matters
- Faster dispute resolution mechanisms
- Indian commercial precedents and case laws
- State-specific commercial court procedures

Format response as JSON:
{
  "caseClassification": "${caseType}",
  "jurisdiction": "${jurisdiction}",
  "caseSummary": "Commercial case summary under Indian Commercial Courts Act",
  "legalIssues": ["commercial issue1", "commercial issue2"],
  "searchTerms": ["commercial term1", "commercial term2", "commercial term3", "commercial term4", "commercial term5"],
  "relevantLaws": ["Commercial Courts Act 2015", "specific commercial law", "relevant section"],
  "predictiveAnalysis": {
    "likelyOutcome": "prediction based on commercial precedents",
    "timelineEstimate": "estimated resolution time for commercial courts",
    "successProbability": "percentage based on similar cases",
    "keyFactors": ["factor1", "factor2"]
  },
  "keyPrecedents": ["precedent1", "precedent2", "precedent3"],
  "proceduralGuidance": ["procedure1", "procedure2"],
  "jurisdictionSpecific": ["local rule1", "local rule2"],
  "multilingualTerms": {
    "hindi": ["term1", "term2"],
    "english": ["term1", "term2"]
  }
}
  `
  const resp = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }]
  })

  // Try to pull out the JSON block
  try {
    const responseText = resp.response?.text() || resp.text || '';
    console.log('🏛️ Commercial Courts Analysis:', responseText.substring(0, 300) + '...');
    
    const match = responseText.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch (err) {
    console.error('Error parsing Commercial Courts Analysis:', err);
  }

  // Enhanced fallback for commercial courts
  return {
    caseClassification: caseType,
    jurisdiction: jurisdiction,
    caseSummary: 'Commercial dispute analysis under Commercial Courts Act 2015',
    legalIssues: ['Commercial dispute under Indian Commercial Courts Act 2015'],
    searchTerms: [
      query, 
      `${query} Commercial Courts Act 2015`, 
      `${query} commercial dispute India`,
      `${query} commercial court ${jurisdiction}`,
      `${query} business law India`
    ],
    relevantLaws: ['Commercial Courts Act 2015', 'Indian Contract Act 1872', 'Arbitration and Conciliation Act 2015'],
    predictiveAnalysis: {
      likelyOutcome: 'Outcome depends on commercial law precedents',
      timelineEstimate: 'Commercial courts aim for faster resolution as per 2015 Act',
      successProbability: 'Analysis requires more case details',
      keyFactors: ['Commercial Courts Act 2015 provisions', 'Business dispute nature']
    },
    keyPrecedents: ['Commercial Courts Act 2015 precedents applicable'],
    proceduralGuidance: ['Follow Commercial Courts Act 2015 procedures'],
    jurisdictionSpecific: [`${jurisdiction} High Court commercial rules`],
    multilingualTerms: {
      hindi: ['व्यावसायिक न्यायालय', 'व्यापारिक विवाद'],
      english: ['Commercial Court', 'Business Dispute']
    }
  }
}

// 2) Enhanced Kanoon search with commercial courts focus and data localization
async function kanoonSearchCommercial(terms, jurisdiction = 'general') {
  // Add commercial-specific search modifiers
  const commercialTerms = terms.flatMap(term => [
    term,
    `${term} commercial court`,
    `${term} Commercial Courts Act 2015`,
    `${term} business dispute ${jurisdiction}`
  ]);

  const promises = commercialTerms.map(async term => {
    try {
      const res = await fetch(
        `https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(term)}&pagenum=0`,
        { headers: { Authorization: `Token ${process.env.IK_TOKEN}` } }
      )
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json()
      return { 
        term, 
        results: (json.results || []).map(result => ({
          ...result,
          relevanceScore: calculateCommercialRelevance(result, term),
          jurisdiction: extractJurisdiction(result),
          isCommercialCase: isCommercialCase(result)
        }))
      }
    } catch (err) {
      console.error(`🏛️ Commercial Kanoon error for "${term}":`, err)
      return { term, results: [] }
    }
  })

  const all = await Promise.all(promises)
  const seen = new Set()
  const combined = []

  // Prioritize commercial cases and jurisdiction-specific results
  all.forEach(group => {
    group.results
      .filter(doc => doc.isCommercialCase || doc.relevanceScore > 0.5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .forEach(doc => {
        if (!seen.has(doc.title)) {
          seen.add(doc.title)
          combined.push({ 
            ...doc, 
            matchedTerm: group.term,
            dataLocalization: doc.jurisdiction === jurisdiction ? 'Local' : 'National'
          })
        }
      })
  })

  return { 
    breakdown: all, 
    combined: combined.slice(0, 15), // More results for commercial analysis
    commercialCases: combined.filter(c => c.isCommercialCase),
    localJurisdiction: combined.filter(c => c.jurisdiction === jurisdiction)
  }
}

// Helper functions for commercial courts analysis
function calculateCommercialRelevance(result, searchTerm) {
  const title = (result.title || '').toLowerCase();
  const snippet = (result.snippet || '').toLowerCase();
  const text = title + ' ' + snippet;
  
  const commercialKeywords = [
    'commercial', 'business', 'contract', 'trade', 'commerce', 'arbitration',
    'company', 'corporate', 'merchant', 'sale', 'purchase', 'agreement',
    'commercial courts act', 'ease of doing business'
  ];
  
  let score = 0;
  commercialKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 0.2;
  });
  
  return Math.min(score, 1.0);
}

function extractJurisdiction(result) {
  const text = ((result.title || '') + ' ' + (result.court || '')).toLowerCase();
  const jurisdictions = [
    'supreme court', 'delhi high court', 'bombay high court', 'madras high court',
    'calcutta high court', 'karnataka high court', 'gujarat high court',
    'punjab and haryana high court', 'rajasthan high court', 'allahabad high court'
  ];
  
  for (const jurisdiction of jurisdictions) {
    if (text.includes(jurisdiction)) {
      return jurisdiction.replace(' high court', '').replace('supreme court', 'supreme');
    }
  }
  return 'general';
}

function isCommercialCase(result) {
  const text = ((result.title || '') + ' ' + (result.snippet || '')).toLowerCase();
  return text.includes('commercial') || text.includes('business') || 
         text.includes('commercial courts act') || text.includes('trade dispute');
}

// 3) Enhanced Commercial Courts Research Engine endpoint
app.post('/legal_query', async (req, res) => {
  try {
    const query = (req.body.query || '').trim()
    const caseType = req.body.caseType || 'general'
    const jurisdiction = req.body.jurisdiction || 'general'
    const language = req.body.language || 'english'
    
    if (!query) return res.status(400).json({ error: 'Query is required' })

    console.log('�️ AI-Driven Commercial Courts Research Engine Starting...')
    console.log(`📋 Case Type: ${caseType}, Jurisdiction: ${jurisdiction}, Language: ${language}`)
    
    const analysis = await geminiAnalyzeCommercialCase(query, caseType, jurisdiction, language)
    console.log('✅ Commercial legal analysis complete:', { 
      classification: analysis.caseClassification,
      jurisdiction: analysis.jurisdiction,
      termCount: analysis.searchTerms?.length 
    });

    console.log('📚 Searching Commercial Case Laws with Data Localization...')
    const kanoon = await kanoonSearchCommercial(analysis.searchTerms, jurisdiction)
    console.log('✅ Commercial case law search complete:', {
      totalResults: kanoon.combined?.length || 0,
      commercialCases: kanoon.commercialCases?.length || 0,
      localJurisdiction: kanoon.localJurisdiction?.length || 0
    });

    // Enhanced response structure for Commercial Courts
    const response = {
      metadata: {
        timestamp: new Date().toISOString(),
        engineVersion: "AI-Driven Commercial Courts Research Engine v1.0",
        caseClassification: analysis.caseClassification,
        jurisdiction: analysis.jurisdiction,
        language: language,
        processingTime: "Real-time analysis completed"
      },
      originalQuery: query,
      caseAnalysis: analysis,
      searchResults: {
        allResults: kanoon.combined,
        commercialSpecific: kanoon.commercialCases,
        jurisdictionSpecific: kanoon.localJurisdiction,
        searchBreakdown: kanoon.breakdown
      },
      aiFeatures: {
        predictiveAnalytics: analysis.predictiveAnalysis,
        dataLocalization: `Results customized for ${jurisdiction} jurisdiction`,
        multilingualSupport: analysis.multilingualTerms,
        ethicalAI: "Engine operates as facilitator, not decision-maker",
        reliability: "Results based on Indian Commercial Courts Act 2015 and precedents"
      }
    }

    res.json(response);
  } catch (err) {
    console.error('❌ Commercial Courts Research Engine error:', err)
    res.status(500).json({ 
      error: 'Commercial Courts Research Engine error', 
      details: err.message,
      ethicalNote: "AI Engine encountered an error - Human oversight recommended"
    });
  }
})

app.listen(5000, () => {
  console.log('🏛️ AI-Driven Research Engine for Commercial Courts v1.0')
  console.log('🚀 Server running on http://localhost:5000')
  console.log('📋 Features: Predictive Analytics, Data Localization, Multilingual Support')
  console.log('⚖️  Ethical AI: Facilitator mode - Human oversight maintained')
  console.log('🇮🇳 Focus: Commercial Courts Act 2015 & Ease of Doing Business')
})
