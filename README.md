# 🏛️ AI-Driven Research Engine for Commercial Courts

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](https://react.dev)
[![Express](https://img.shields.io/badge/Backend-Express%205-green.svg)](https://expressjs.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20GenAI-orange.svg)](https://ai.google.dev/)
[![Indian Kanoon](https://img.shields.io/badge/Database-Indian%20Kanoon%20API-blue.svg)](https://indiankanoon.org/)

An intelligent legal research platform specifically engineered for Commercial Courts in India under the **Commercial Courts Act 2015**. The engine accelerates dispute resolution and fosters ease of doing business by combining state-of-the-art Generative AI with live Indian legal jurisprudence.

---

## 🌟 Key Features

- **🏛️ Commercial Dispute Analysis**: Automated parsing of complex commercial claims, identifying core legal issues, relevant statutory sections, and case classifications (Contract, Arbitration, Corporate, IP, Banking, Insolvency).
- **🔮 Predictive Analytics**: Estimated case outcomes, expected resolution timelines under statutory Commercial Court rules, and critical success factors.
- **📍 High Court Data Localization**: Automatically tags and prioritizes precedents originating from the relevant jurisdiction (Delhi, Bombay, Madras, Calcutta, Karnataka, Gujarat, etc.).
- **📚 Live Precedents & Judgments**: Deep integration with the Indian Kanoon API for retrieving real, clickable case law citations with relevance scoring.
- **🌐 Multilingual Terminology**: Commercial legal terminology translated across English and Hindi for enhanced accessibility.
- **⚖️ Ethical AI Facilitation**: Engineered as an assistive research co-pilot with human oversight embedded into recommendations and disclosures.

---

## 📊 Model Performance & Research Benchmarks

Comprehensive details regarding model fine-tuning (DistilBERT, BERT, RoBERTa, XLNet, Hierarchical BiGRU), hyperparameters, evaluation metrics (ROUGE, BLEU, METEOR, Jaccard), Integrated Gradients token attribution heatmaps, and human legal expert comparisons are documented in:

👉 **[`model_performance_and_analysis/`](model_performance_and_analysis/README.md)**

- **Top Model**: Hierarchical XLNet + BiGRU (**78.0% Accuracy**, **77.8% F1**)
- **Human Benchmark**: Legal Experts (**94.0% Accuracy**)
- **Explainability**: Two-stage Hierarchical Occlusion and token saliency maps benchmarked against 5 legal experts.

---

## 📁 Repository Structure

```
AI_Research_Engine/
├── client/                              # React Single Page Application (SPA)
│   ├── public/                          # Static assets and index.html
│   ├── src/                             # React components & application logic
│   │   ├── App.js                       # Primary legal research user interface
│   │   ├── App.css                      # Styling definitions
│   │   └── index.js                     # React DOM entry point
│   └── package.json                     # Client dependencies & build scripts
│
├── server/                              # Node.js / Express Backend API
│   ├── index.js                         # API endpoints, Gemini SDK & Kanoon search
│   ├── .env.example                     # Environment template (keys required)
│   └── package.json                     # Backend dependencies & server scripts
│
├── model_performance_and_analysis/      # Fine-tuning benchmarks, metrics & explainability
│   ├── README.md                        # Deep research report, hyperparams & comparisons
│   ├── plots/                           # High-res attribution heatmaps, t-SNE & ROC/ROUGE plots
│   └── evaluation_metrics/              # Raw metric evaluations across expert ranks
│
├── mlsamp.py                            # PDF law and statutory document aggregator
├── estimate_commercial_judgments.py     # Commercial suits metadata scanner
├── package.json                         # Root package management script
├── .gitignore                           # Git ignore rules for node_modules, build & secrets
└── README.md                            # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.8+ (for running document aggregation utilities)

---

### Step 1: Install Dependencies

From the project root:

```bash
# Install both backend and frontend dependencies
npm run install:all
```

Or install individually:

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your API credentials:

```env
# Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Specific Gemini model override (defaults to gemini-3.5-flash with resilient fallback)
GEMINI_MODEL=gemini-3.5-flash

# Indian Kanoon API Token (https://api.indiankanoon.org/)
IK_TOKEN=your_indian_kanoon_token_here

# Server Port (default: 5000)
PORT=5000
```

> [!NOTE]
> The engine includes an automated multi-model fallback chain (`gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-3.8-flash`, `gemini-flash-latest`) to maintain uptime during API traffic surges.

---

### Step 3: Start the Backend Server

```bash
npm run start:server
```

Or from the `server/` folder:

```bash
cd server
node index.js
```

The API server will listen on `http://localhost:5000`. You can verify status at `http://localhost:5000/health`.

---

### Step 4: Start the Frontend Application

In a separate terminal:

```bash
npm run start:client
```

Or from the `client/` folder:

```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔌 API Reference

### Health Check

```http
GET /health
```

**Sample Response:**
```json
{
  "status": "online",
  "version": "1.0.0",
  "service": "AI-Driven Research Engine for Commercial Courts",
  "geminiConfigured": true,
  "kanoonConfigured": true,
  "activeModel": "gemini-3.5-flash"
}
```

---

### Commercial Case Query

```http
POST /legal_query
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "breach of commercial supply agreement and forfeiture of earnest money",
  "caseType": "contract",
  "jurisdiction": "delhi",
  "language": "english"
}
```

**Response Parameters:**
- `caseAnalysis`: Commercial summary, legal issues, suggested search terms, relevant statutes, predictive analytics, and precedents.
- `searchResults`: Deduplicated judgments from Indian Kanoon categorized into `allResults`, `commercialSpecific`, and `jurisdictionSpecific` with direct links.
- `aiFeatures`: Predictive metrics, data localization status, multilingual vocabulary, and ethical AI declaration.

---

## 🛠️ Python Utilities

### PDF Law Document Aggregator (`mlsamp.py`)

Extracts text from Commercial Court and Indian law PDFs using PyMuPDF and compiles them into a unified reference corpus:

```bash
python mlsamp.py [path_to_pdf_folder]
```

### Commercial Judgment Estimator (`estimate_commercial_judgments.py`)

Downloads and inspects court case metadata indices to estimate commercial suit counts and storage requirements:

```bash
python estimate_commercial_judgments.py
```

---

## 🔒 Security Best Practices

- **Never commit `.env` or sensitive API keys to source control.**
- The root `.gitignore` is configured to exclude all `.env` files, build directories, and `node_modules/`.
- Ensure all production deployments utilize environment-level secret injection.

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
