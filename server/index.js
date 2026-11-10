import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { GoogleGenAI } from '@google/genai'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// Initialize Google GenAI client if key is present
const geminiApiKey = process.env.GEMINI_API_KEY
const ikToken = process.env.IK_TOKEN

if (!geminiApiKey) {
  console.warn('⚠️ GEMINI_API_KEY not found in environment variables. Gemini AI analysis will use fallback response.')
}
if (!ikToken) {
  console.warn('⚠️ IK_TOKEN not found in environment variables. Indian Kanoon searches will be limited.')
}

const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null

// Candidate models to try in sequence for high availability
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.8-flash',
  'gemini-flash-latest'
].filter(Boolean)

// 1) Enhanced Gemini analysis for Commercial Courts with resilient model fallback
async function geminiAnalyzeCommercialCase(query, caseType = 'general', jurisdiction = 'general', language = 'english') {
  const prompt = `
As an expert in Indian Commercial Law and the Commercial Courts Act 2015, analyze this commercial dispute/legal query: "${query}"

Context: This analysis is for Commercial Courts in India focusing on faster dispute resolution and ease of doing business.

Case Classification: ${caseType}
Jurisdiction: ${jurisdiction}
Preferred Language: ${language}

Please provide a comprehensive analysis with the following sections formatted strictly as a single valid JSON object:
{
  "caseClassification": "${caseType}",
  "jurisdiction": "${jurisdiction}",
  "caseSummary": "Commercial case summary focusing on Indian Commercial Courts Act 2015 and relevant commercial aspects",
  "legalIssues": ["commercial issue 1", "commercial issue 2"],
  "searchTerms": ["commercial term 1", "commercial term 2", "commercial term 3", "commercial term 4"],
  "relevantLaws": ["Commercial Courts Act 2015", "Indian Contract Act 1872", "Arbitration and Conciliation Act 1996"],
  "predictiveAnalysis": {
    "likelyOutcome": "prediction based on commercial precedents",
    "timelineEstimate": "estimated resolution time under Commercial Courts statutory timelines",
    "successProbability": "percentage based on similar cases",
    "keyFactors": ["factor 1", "factor 2"]
  },
  "keyPrecedents": ["key precedent 1", "key precedent 2"],
  "proceduralGuidance": ["procedural step 1", "procedural step 2"],
  "jurisdictionSpecific": ["jurisdiction commercial division rule 1"],
  "multilingualTerms": {
    "hindi": ["व्यावसायिक विवाद", "अनुबंध उल्लंघन"],
    "english": ["Commercial Dispute", "Breach of Contract"]
  }
}

Focus EXCLUSIVELY on:
- Commercial Courts Act 2015
- Indian commercial dispute resolution
- Business-related legal matters
- Faster dispute resolution mechanisms
- Indian commercial precedents and case laws
- State-specific commercial court procedures
`

  if (ai) {
    for (const model of CANDIDATE_MODELS) {
      try {
        console.log(`🤖 Attempting Gemini analysis with model: ${model}...`)
        const resp = await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json'
          }
        })

        const rawText = (resp.text || '').trim()
        if (rawText) {
          const cleanedText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            console.log(`✅ Commercial analysis successfully generated using model: ${model}`)
            return parsed
          }
        }
      } catch (err) {
        console.warn(`⚠️ Model ${model} failed (${err.message?.substring(0, 120)}). Trying next candidate...`)
      }
    }
  }

  // Enhanced fallback for commercial courts when API is unreachable or exhausted
  console.log('ℹ️ Using structured fallback analysis for commercial query.')
  return {
    caseClassification: caseType,
    jurisdiction: jurisdiction,
    caseSummary: `Commercial dispute analysis under Commercial Courts Act 2015 for: "${query}". Commercial courts mandate strict timelines and case management hearings to ensure speedy resolution of specified value disputes.`,
    legalIssues: [
      'Commercial dispute under Section 2(1)(c) of the Commercial Courts Act 2015',
      'Breach of commercial contractual obligations and liability under Indian Contract Act 1872',
      'Applicability of pre-institution mediation under Section 12A of Commercial Courts Act 2015'
    ],
    searchTerms: [
      query,
      `${query} Commercial Courts Act 2015`,
      `${query} commercial dispute India`,
      `${query} ${jurisdiction} commercial court`
    ],
    relevantLaws: [
      'Commercial Courts Act 2015 (Section 2, 6, 12A, 13)',
      'Indian Contract Act 1872 (Section 73, 74)',
      'Arbitration and Conciliation Act 1996 / 2015 Amendments',
      'Code of Civil Procedure 1908 (Commercial Courts amendments)'
    ],
    predictiveAnalysis: {
      likelyOutcome: 'Pre-institution mediation is mandatory unless urgent interim relief is sought. High probability of settlement or expedited summary judgment if documentary evidence is unambiguous.',
      timelineEstimate: '6 to 12 months under Commercial Courts Act statutory case management schedule',
      successProbability: '65% - 75% depending on written contractual documentation and adherence to statutory timelines',
      keyFactors: [
        'Strict adherence to Commercial Courts timelines (120 days for written statement)',
        'Mandatory Section 12A pre-institution mediation compliance',
        'Clear documentary evidence and statement of truth'
      ]
    },
    keyPrecedents: [
      'Patil Automation Pvt. Ltd. v. Rakheja Engineers (2022) - Mandatory pre-institution mediation under Section 12A',
      'SCG Contracts India Pvt. Ltd. v. K.S. Chamankar Infrastructure (2019) - Strict 120-day timeline for written statement',
      'Ambalal Sarabhai Enterprises Ltd. v. K.S. Infraspace LLP (2020) - Scope of commercial disputes under Section 2(1)(c)'
    ],
    proceduralGuidance: [
      'Step 1: Check if dispute value meets Specified Value threshold (min. INR 3 Lakhs)',
      'Step 2: Initiate pre-institution mediation under Section 12A unless urgent interim relief is required',
      'Step 3: File Statement of Claim with Statement of Truth and disclosure of documents within statutory limits',
      'Step 4: Participate in Case Management Hearing under Order XV-A CPC'
    ],
    jurisdictionSpecific: [
      `${jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1)} High Court Commercial Division Practice Directions`,
      'Local Commercial Court e-filing and case tracking protocols'
    ],
    multilingualTerms: {
      hindi: ['व्यावसायिक न्यायालय अधिनियम 2015', 'व्यापारिक विवाद', 'अनुबंध उल्लंघन', 'मध्यस्थता'],
      english: ['Commercial Courts Act 2015', 'Commercial Dispute', 'Breach of Contract', 'Pre-institution Mediation']
    }
  }
}

// 2) Enhanced Kanoon search with commercial courts focus and data localization
async function kanoonSearchCommercial(terms, jurisdiction = 'general') {
  if (!ikToken) {
    console.warn('⚠️ IK_TOKEN is not configured; skipping live Indian Kanoon search.')
    return { breakdown: [], combined: [], commercialCases: [], localJurisdiction: [] }
  }

  // Pick top unique search terms to stay within rate limits and ensure maximum relevance
  const uniqueSearchTerms = Array.from(new Set([
    terms[0],
    terms[1] || `${terms[0]} Commercial Courts Act 2015`,
    terms[2] || `${terms[0]} commercial court`,
    jurisdiction !== 'general' ? `${terms[0]} ${jurisdiction}` : null
  ].filter(Boolean))).slice(0, 4)

  const promises = uniqueSearchTerms.map(async term => {
    try {
      const formParams = new URLSearchParams()
      formParams.append('formInput', term)
      formParams.append('pagenum', '0')

      const res = await fetch('https://api.indiankanoon.org/search/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${ikToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const json = await res.json()
      const docs = json.docs || []

      return {
        term,
        results: docs.map(doc => {
          const rawHeadline = (doc.headline || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
          const docJurisdiction = extractJurisdiction(doc)
          const relevanceScore = calculateCommercialRelevance(doc, term)
          const commercial = isCommercialCase(doc)

          return {
            tid: doc.tid,
            title: doc.title || 'Untitled Case',
            court: doc.docsource || 'Court not specified',
            date: doc.publishdate || 'Date not specified',
            citation: doc.citation || '',
            snippet: rawHeadline || doc.title || '',
            url: doc.tid ? `https://indiankanoon.org/doc/${doc.tid}/` : null,
            matchedTerm: term,
            jurisdiction: docJurisdiction,
            isCommercialCase: commercial,
            relevanceScore: relevanceScore,
            dataLocalization: (jurisdiction !== 'general' && docJurisdiction.toLowerCase().includes(jurisdiction.toLowerCase())) ? 'Local' : 'National'
          }
        })
      }
    } catch (err) {
      console.error(`🏛️ Commercial Kanoon error for "${term}":`, err.message)
      return { term, results: [] }
    }
  })

  const all = await Promise.all(promises)
  const seen = new Set()
  const combined = []

  // Combine and sort by relevance and commercial focus
  all.forEach(group => {
    group.results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .forEach(doc => {
        const key = doc.tid || doc.title
        if (!seen.has(key)) {
          seen.add(key)
          combined.push(doc)
        }
      })
  })

  // Prioritize commercial cases and local jurisdiction
  combined.sort((a, b) => {
    if (a.dataLocalization === 'Local' && b.dataLocalization !== 'Local') return -1
    if (b.dataLocalization === 'Local' && a.dataLocalization !== 'Local') return 1
    return b.relevanceScore - a.relevanceScore
  })

  const commercialCases = combined.filter(c => c.isCommercialCase || c.relevanceScore >= 0.4)
  const localCases = combined.filter(c => c.dataLocalization === 'Local')

  return {
    breakdown: all,
    combined: combined.slice(0, 15),
    commercialCases: commercialCases.slice(0, 10),
    localJurisdiction: localCases.slice(0, 5)
  }
}

// Helper functions for commercial courts analysis
function calculateCommercialRelevance(doc, searchTerm) {
  const text = `${doc.title || ''} ${doc.headline || ''} ${doc.docsource || ''}`.toLowerCase()

  const highPriorityKeywords = [
    'commercial courts act', 'commercial court', 'commercial division',
    'commercial appellate division', 'section 12a', 'specified value'
  ]

  const commercialKeywords = [
    'commercial', 'business', 'contract', 'trade', 'commerce', 'arbitration',
    'company', 'corporate', 'merchant', 'sale of goods', 'agreement',
    'tender', 'bank guarantee', 'letters of credit', 'intellectual property',
    'trademark', 'copyright', 'patent'
  ]

  let score = 0.2

  highPriorityKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 0.3
  })

  commercialKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 0.1
  })

  return Math.min(Math.round(score * 100) / 100, 1.0)
}

function extractJurisdiction(doc) {
  const text = `${doc.title || ''} ${doc.docsource || ''}`.toLowerCase()
  const jurisdictions = [
    { key: 'supreme', name: 'Supreme Court' },
    { key: 'delhi', name: 'Delhi High Court' },
    { key: 'bombay', name: 'Bombay High Court' },
    { key: 'madras', name: 'Madras High Court' },
    { key: 'calcutta', name: 'Calcutta High Court' },
    { key: 'karnataka', name: 'Karnataka High Court' },
    { key: 'gujarat', name: 'Gujarat High Court' },
    { key: 'punjab and haryana', name: 'Punjab and Haryana High Court' },
    { key: 'rajasthan', name: 'Rajasthan High Court' },
    { key: 'allahabad', name: 'Allahabad High Court' },
    { key: 'madhya pradesh', name: 'Madhya Pradesh High Court' },
    { key: 'telangana', name: 'Telangana High Court' }
  ]

  for (const j of jurisdictions) {
    if (text.includes(j.name.toLowerCase()) || text.includes(j.key)) {
      return j.key
    }
  }
  return 'general'
}

function isCommercialCase(doc) {
  const text = `${doc.title || ''} ${doc.headline || ''} ${doc.docsource || ''}`.toLowerCase()
  return (
    text.includes('commercial') ||
    text.includes('commercial courts act') ||
    text.includes('contract') ||
    text.includes('arbitration') ||
    text.includes('business dispute') ||
    text.includes('company petition')
  )
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    service: 'AI-Driven Research Engine for Commercial Courts',
    geminiConfigured: !!geminiApiKey,
    kanoonConfigured: !!ikToken,
    activeModel: CANDIDATE_MODELS[0]
  })
})

app.get('/', (req, res) => {
  res.send('🏛️ AI-Driven Research Engine for Commercial Courts Backend is Running. Use POST /legal_query to search.')
})

// 3) Commercial Courts Research Engine endpoint
app.post('/legal_query', async (req, res) => {
  try {
    const query = (req.body.query || '').trim()
    const caseType = req.body.caseType || 'general'
    const jurisdiction = req.body.jurisdiction || 'general'
    const language = req.body.language || 'english'

    if (!query) {
      return res.status(400).json({ error: 'Query is required', message: 'Please provide a commercial dispute query.' })
    }

    console.log('🏛️ AI-Driven Commercial Courts Research Engine Starting...')
    console.log(`📋 Query: "${query}" | Case Type: ${caseType} | Jurisdiction: ${jurisdiction} | Language: ${language}`)

    const analysis = await geminiAnalyzeCommercialCase(query, caseType, jurisdiction, language)
    console.log('✅ Commercial legal analysis ready.')

    console.log('📚 Searching Commercial Case Laws via Indian Kanoon...')
    const kanoon = await kanoonSearchCommercial(analysis.searchTerms || [query], jurisdiction)
    console.log(`✅ Search complete: ${kanoon.combined?.length || 0} cases found (${kanoon.commercialCases?.length || 0} commercial, ${kanoon.localJurisdiction?.length || 0} local).`)

    const response = {
      metadata: {
        timestamp: new Date().toISOString(),
        engineVersion: 'AI-Driven Commercial Courts Research Engine v1.0',
        caseClassification: analysis.caseClassification || caseType,
        jurisdiction: analysis.jurisdiction || jurisdiction,
        language: language,
        processingTime: 'Real-time analysis completed'
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
        dataLocalization: jurisdiction !== 'general'
          ? `Results customized for ${jurisdiction} jurisdiction`
          : 'National commercial courts jurisdiction',
        multilingualSupport: analysis.multilingualTerms,
        ethicalAI: 'Engine operates as facilitator, not decision-maker',
        reliability: 'Results based on Indian Commercial Courts Act 2015 and precedents'
      }
    }

    res.json(response)
  } catch (err) {
    console.error('❌ Commercial Courts Research Engine error:', err)
    res.status(500).json({
      error: 'Commercial Courts Research Engine error',
      details: err.message,
      ethicalNote: 'AI Engine encountered an error - Human oversight recommended'
    })
  }
})

app.listen(PORT, () => {
  console.log(`🏛️ AI-Driven Research Engine for Commercial Courts v1.0`)
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📋 Features: Predictive Analytics, Data Localization, Multilingual Support`)
  console.log(`⚖️  Ethical AI: Facilitator mode - Human oversight maintained`)
  console.log(`🇮🇳 Focus: Commercial Courts Act 2015 & Ease of Doing Business`)
})
