import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [caseType, setCaseType] = useState('general')
  const [jurisdiction, setJurisdiction] = useState('general')
  const [language, setLanguage] = useState('english')

  const search = async () => {
    if (!query.trim()) {
      setError('Please enter a commercial dispute query')
      return
    }
    
    setLoading(true)
    setError(null)
    setData(null) // Clear previous data
    try {
      const res = await axios.post('http://localhost:5000/legal_query', { 
        query, 
        caseType, 
        jurisdiction, 
        language 
      })
      console.log('Commercial Courts API Response:', res.data) // Debug log
      setData(res.data)
    } catch (err) {
      console.error('Commercial Courts Research Engine error:', err)
      if (err.response) {
        // Server responded with error
        const errMsg = err.response.data?.error || err.response.data?.message || `HTTP ${err.response.status}`
        const errDetails = err.response.data?.details ? ` (${err.response.data.details})` : ''
        setError(`Commercial Courts Engine: ${errMsg}${errDetails}`)
      } else if (err.request) {
        // Network error
        setError('Failed to connect to Commercial Courts Research Engine. Please check if the server is running on port 5000.')
      } else {
        // Other error
        setError(`Error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c5aa0' }}>🏛️ AI-Driven Research Engine for Commercial Courts</h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
          Commercial Courts Act 2015 | Faster Dispute Resolution | Ease of Doing Business
        </p>
        <p style={{ color: '#888', fontSize: '14px' }}>
          ⚖️ Ethical AI Facilitator | 🇮🇳 Indian Commercial Law Focus | 🌐 Multilingual Support
        </p>
      </header>

      {/* Enhanced Input Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Commercial Dispute Query:
          </label>
          <input
            placeholder="Describe your commercial dispute (e.g., 'breach of software licensing agreement', 'payment dispute in supply contract')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !loading) search() }}
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Case Type:
            </label>
            <select 
              value={caseType} 
              onChange={e => setCaseType(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="general">General Commercial</option>
              <option value="contract">Contract Dispute</option>
              <option value="arbitration">Arbitration</option>
              <option value="intellectual_property">IP Dispute</option>
              <option value="corporate">Corporate Law</option>
              <option value="banking">Banking & Finance</option>
              <option value="insolvency">Insolvency</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Jurisdiction:
            </label>
            <select 
              value={jurisdiction} 
              onChange={e => setJurisdiction(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="general">All India</option>
              <option value="supreme">Supreme Court</option>
              <option value="delhi">Delhi High Court</option>
              <option value="bombay">Bombay High Court</option>
              <option value="madras">Madras High Court</option>
              <option value="calcutta">Calcutta High Court</option>
              <option value="karnataka">Karnataka High Court</option>
              <option value="gujarat">Gujarat High Court</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Language:
            </label>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="bilingual">English + Hindi</option>
            </select>
          </div>
        </div>

        <button 
          onClick={search} 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#2c5aa0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔍 Analyzing Commercial Case...' : '🏛️ Analyze Commercial Dispute'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          margin: '10px 0', 
          padding: '10px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {data && (
        <div>
          {/* Metadata Section */}
          <div style={{ backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>
              📊 {data.metadata?.engineVersion || 'Commercial Courts Analysis'}
            </h3>
            <div style={{ fontSize: '14px', color: '#555' }}>
              <strong>Classification:</strong> {data.metadata?.caseClassification} | 
              <strong> Jurisdiction:</strong> {data.metadata?.jurisdiction} | 
              <strong> Language:</strong> {data.metadata?.language} | 
              <strong> Processed:</strong> {data.metadata?.timestamp ? new Date(data.metadata.timestamp).toLocaleString() : 'Now'}
            </div>
          </div>

          {/* Commercial Case Analysis */}
          <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <h2 style={{ color: '#2c5aa0', marginTop: '0' }}>🏛️ Commercial Courts Analysis</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3>📋 Case Summary</h3>
              <p>{data.caseAnalysis?.caseSummary || 'Commercial case analysis not available'}</p>
            </div>
            
            {data.caseAnalysis?.legalIssues && data.caseAnalysis.legalIssues.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>⚖️ Commercial Legal Issues:</h4>
                <ul>
                  {data.caseAnalysis.legalIssues.map((issue, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.caseAnalysis?.relevantLaws && data.caseAnalysis.relevantLaws.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>📚 Relevant Commercial Laws:</h4>
                <ul>
                  {data.caseAnalysis.relevantLaws.map((law, i) => (
                    <li key={i} style={{ marginBottom: '5px', fontWeight: 'bold', color: '#2c5aa0' }}>{law}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Predictive Analytics */}
            {data.caseAnalysis?.predictiveAnalysis && (
              <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <h4>🔮 Predictive Analytics</h4>
                <p><strong>Likely Outcome:</strong> {data.caseAnalysis.predictiveAnalysis.likelyOutcome}</p>
                <p><strong>Timeline Estimate:</strong> {data.caseAnalysis.predictiveAnalysis.timelineEstimate}</p>
                <p><strong>Success Probability:</strong> {data.caseAnalysis.predictiveAnalysis.successProbability}</p>
                {data.caseAnalysis.predictiveAnalysis.keyFactors && (
                  <div>
                    <strong>Key Factors:</strong>
                    <ul>
                      {data.caseAnalysis.predictiveAnalysis.keyFactors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Multilingual Support */}
            {data.caseAnalysis?.multilingualTerms && (
              <div style={{ backgroundColor: '#f0f8f0', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <h4>🌐 Multilingual Legal Terms</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {data.caseAnalysis.multilingualTerms.english && (
                    <div>
                      <strong>English:</strong>
                      <ul>
                        {data.caseAnalysis.multilingualTerms.english.map((term, i) => (
                          <li key={i}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.caseAnalysis.multilingualTerms.hindi && (
                    <div>
                      <strong>Hindi:</strong>
                      <ul>
                        {data.caseAnalysis.multilingualTerms.hindi.map((term, i) => (
                          <li key={i}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Commercial Cases & Precedents */}
          <h2 style={{ color: '#2c5aa0' }}>📚 Commercial Cases & Precedents</h2>
          
          {/* Data Localization Results */}
          {data.searchResults?.jurisdictionSpecific && data.searchResults.jurisdictionSpecific.length > 0 && (
            <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h3>📍 Local Jurisdiction Cases ({data.metadata?.jurisdiction})</h3>
              {data.searchResults.jurisdictionSpecific.slice(0, 3).map((doc, i) => (
                <div key={i} style={{ border: '1px solid #4CAF50', padding: '10px', margin: '5px 0', borderRadius: '4px', backgroundColor: 'white' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>
                    {doc.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2e7d32', textDecoration: 'underline' }}>
                        {doc.title || 'No title'} ↗
                      </a>
                    ) : (
                      <span style={{ color: '#2e7d32' }}>{doc.title || 'No title'}</span>
                    )}
                  </h4>
                  <p><strong>Court:</strong> {doc.court || 'Unknown court'} | <strong>Date:</strong> {doc.date || 'No date'}</p>
                  {doc.citation && <p><strong>Citation:</strong> {doc.citation}</p>}
                  <p><strong>Relevance:</strong> {doc.dataLocalization} | <strong>Found via:</strong> <em>{doc.matchedTerm}</em></p>
                  {doc.snippet && <p><strong>Summary:</strong> {doc.snippet}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Commercial Specific Results */}
          {data.searchResults?.commercialSpecific && data.searchResults.commercialSpecific.length > 0 && (
            <div style={{ backgroundColor: '#fff8e1', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h3>🏛️ Commercial Courts Act 2015 Cases</h3>
              {data.searchResults.commercialSpecific.slice(0, 5).map((doc, i) => (
                <div key={i} style={{ border: '1px solid #ff9800', padding: '10px', margin: '5px 0', borderRadius: '4px', backgroundColor: 'white' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>
                    {doc.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#e65100', textDecoration: 'underline' }}>
                        {doc.title || 'No title'} ↗
                      </a>
                    ) : (
                      <span style={{ color: '#e65100' }}>{doc.title || 'No title'}</span>
                    )}
                  </h4>
                  <p><strong>Court:</strong> {doc.court || 'Unknown court'} | <strong>Date:</strong> {doc.date || 'No date'}</p>
                  {doc.citation && <p><strong>Citation:</strong> {doc.citation}</p>}
                  <p><strong>Commercial Relevance:</strong> {Math.round((doc.relevanceScore || 0) * 100)}% | <strong>Type:</strong> Commercial Case</p>
                  <p><strong>Search Term:</strong> <em>{doc.matchedTerm}</em></p>
                  {doc.snippet && <p><strong>Summary:</strong> {doc.snippet}</p>}
                </div>
              ))}
            </div>
          )}

          {/* All Results */}
          {data.searchResults?.allResults && data.searchResults.allResults.length > 0 ? (
            <div>
              <h3>📋 All Relevant Cases ({data.searchResults.allResults.length} found)</h3>
              {data.searchResults.allResults.map((doc, i) => (
                <div key={i} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0', borderRadius: '3px' }}>
                  <h4>
                    {doc.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1a0dab', textDecoration: 'underline' }}>
                        {doc.title || 'No title'} ↗
                      </a>
                    ) : (
                      doc.title || 'No title'
                    )}
                  </h4>
                  <p><strong>Court:</strong> {doc.court || 'Unknown court'}</p>
                  <p><strong>Date:</strong> {doc.date || 'No date'}</p>
                  {doc.citation && <p><strong>Citation:</strong> {doc.citation}</p>}
                  <p><strong>Found via search:</strong> <em>{doc.matchedTerm}</em></p>
                  {doc.isCommercialCase && <p style={{ color: '#2c5aa0', fontWeight: 'bold' }}>✓ Commercial Case</p>}
                  {doc.dataLocalization && <p><strong>Data Localization:</strong> {doc.dataLocalization}</p>}
                  {doc.snippet && <p><strong>Snippet:</strong> {doc.snippet}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>No commercial cases found for the specified criteria</p>
          )}

          {/* AI Features Summary */}
          {data.aiFeatures && (
            <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
              <h3>🤖 AI Research Engine Features</h3>
              <ul>
                <li><strong>Predictive Analytics:</strong> {data.aiFeatures.predictiveAnalytics ? 'Enabled' : 'Available'}</li>
                <li><strong>Data Localization:</strong> {data.aiFeatures.dataLocalization}</li>
                <li><strong>Multilingual Support:</strong> {data.aiFeatures.multilingualSupport ? 'Available' : 'Enabled'}</li>
                <li><strong>Ethical AI:</strong> {data.aiFeatures.ethicalAI}</li>
                <li><strong>Reliability:</strong> {data.aiFeatures.reliability}</li>
              </ul>
            </div>
          )}

          {/* Search Terms Used */}
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔍 Search Strategy & Terms Used</summary>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              {data.caseAnalysis?.searchTerms && data.caseAnalysis.searchTerms.length > 0 ? (
                <ul>
                  {data.caseAnalysis.searchTerms.map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific search terms generated</p>
              )}
            </div>
          </details>

          {/* Debug section - remove this after testing */}
          <details style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
            <summary>Debug Info (Click to expand)</summary>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

export default App
